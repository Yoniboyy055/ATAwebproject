#!/bin/bash

###############################################################################
# Builder.io Integration Verification Script
# Purpose: Automated verification of Builder.io integration
# Usage: ./verify-builder.sh <deployment-url>
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emoji for better UX
CHECK="✅"
CROSS="❌"
INFO="ℹ️"
WARN="⚠️"
ROCKET="🚀"

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARN} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

###############################################################################
# Main Verification Logic
###############################################################################

main() {
    clear
    print_header "${ROCKET} Builder.io Integration Verification"
    
    # Check if URL is provided
    if [ -z "$1" ]; then
        print_error "Deployment URL is required"
        echo ""
        echo "Usage: $0 <deployment-url>"
        echo ""
        echo "Example:"
        echo "  $0 https://at-awebproject-2lqg.vercel.app"
        echo "  $0 https://amanueltravel.com"
        echo ""
        exit 1
    fi
    
    DEPLOYMENT_URL="$1"
    
    # Remove trailing slash
    DEPLOYMENT_URL="${DEPLOYMENT_URL%/}"
    
    print_info "Target URL: ${DEPLOYMENT_URL}"
    echo ""
    
    # Step 1: Test Health Endpoint
    print_header "Step 1: Testing Health Endpoint"
    
    HEALTH_URL="${DEPLOYMENT_URL}/api/health/builder"
    print_info "Fetching: ${HEALTH_URL}"
    
    HTTP_CODE=$(curl -s -o /tmp/health-response.json -w "%{http_code}" "${HEALTH_URL}" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "000" ]; then
        print_error "Failed to connect to health endpoint"
        print_warning "Possible causes:"
        echo "  - URL is incorrect"
        echo "  - Deployment doesn't exist"
        echo "  - Network connectivity issue"
        echo ""
        exit 1
    fi
    
    print_success "HTTP Status: ${HTTP_CODE}"
    echo ""
    
    # Display response
    if command -v jq &> /dev/null; then
        print_info "Response:"
        cat /tmp/health-response.json | jq '.'
    else
        print_info "Response (install 'jq' for pretty formatting):"
        cat /tmp/health-response.json
    fi
    echo ""
    
    # Parse response
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Health check passed!"
        
        # Extract values
        OK=$(cat /tmp/health-response.json | grep -o '"ok":[^,]*' | cut -d':' -f2 | tr -d ' ')
        HAS_KEY=$(cat /tmp/health-response.json | grep -o '"hasKey":[^,]*' | cut -d':' -f2 | tr -d ' ')
        HAS_SITE_URL=$(cat /tmp/health-response.json | grep -o '"hasSiteUrl":[^,]*' | cut -d':' -f2 | tr -d ' ')
        
        echo ""
        print_info "Status Details:"
        echo "  - Overall: ${OK}"
        echo "  - API Key Configured: ${HAS_KEY}"
        echo "  - Site URL Configured: ${HAS_SITE_URL}"
        echo ""
        
        if [ "$OK" = "true" ]; then
            print_success "Builder.io integration is properly configured!"
        fi
        
    elif [ "$HTTP_CODE" = "503" ]; then
        print_error "Service configuration issue"
        
        # Try to identify missing variable
        if cat /tmp/health-response.json | grep -q '"hasKey":false'; then
            echo ""
            print_error "Missing: NEXT_PUBLIC_BUILDER_API_KEY"
            print_info "Fix: Add this variable in Vercel Dashboard"
            echo ""
            echo "Steps:"
            echo "  1. Go to: https://vercel.com/dashboard"
            echo "  2. Select your project"
            echo "  3. Settings → Environment Variables"
            echo "  4. Add: NEXT_PUBLIC_BUILDER_API_KEY"
            echo "  5. Value: Get from https://builder.io/account/organization"
            echo "  6. Environment: Production, Preview, Development"
            echo "  7. Save and redeploy"
            echo ""
        fi
        
        if cat /tmp/health-response.json | grep -q '"hasSiteUrl":false'; then
            echo ""
            print_error "Missing: NEXT_PUBLIC_SITE_URL"
            print_info "Fix: Add this variable in Vercel Dashboard"
            echo ""
            echo "Steps:"
            echo "  1. Go to: https://vercel.com/dashboard"
            echo "  2. Select your project"
            echo "  3. Settings → Environment Variables"
            echo "  4. Add: NEXT_PUBLIC_SITE_URL"
            echo "  5. Value: ${DEPLOYMENT_URL}"
            echo "  6. Environment: Production, Preview, Development"
            echo "  7. Save and redeploy"
            echo ""
        fi
        
        exit 1
    else
        print_error "Unexpected HTTP status: ${HTTP_CODE}"
        exit 1
    fi
    
    # Step 2: Check if test page exists
    print_header "Step 2: Checking Test Page"
    
    TEST_URL="${DEPLOYMENT_URL}/test"
    print_info "Fetching: ${TEST_URL}"
    
    TEST_HTTP_CODE=$(curl -s -o /tmp/test-page.html -w "%{http_code}" "${TEST_URL}" 2>/dev/null || echo "000")
    
    if [ "$TEST_HTTP_CODE" = "200" ]; then
        print_success "Test page exists and is accessible!"
        
        # Check for title
        if grep -q "Builder Test" /tmp/test-page.html; then
            print_success "Found 'Builder Test' in page title"
        else
            print_warning "Title 'Builder Test' not found - page may not be from Builder.io"
        fi
        
        # Show preview
        echo ""
        print_info "Page preview (first 10 lines):"
        head -10 /tmp/test-page.html
        echo ""
        
    elif [ "$TEST_HTTP_CODE" = "404" ]; then
        print_warning "Test page not found at /test"
        print_info "Create test page in Builder.io:"
        echo ""
        echo "Steps:"
        echo "  1. Login: https://builder.io/login"
        echo "  2. Content → Page → New Entry"
        echo "  3. URL: /test"
        echo "  4. Title: Builder Test"
        echo "  5. Add content and publish"
        echo ""
    else
        print_warning "Unexpected response for test page: ${TEST_HTTP_CODE}"
    fi
    
    # Step 3: Summary
    print_header "Verification Summary"
    
    echo "Health Endpoint: ${HEALTH_URL}"
    echo "  Status: ${HTTP_CODE}"
    echo ""
    
    echo "Test Page: ${TEST_URL}"
    echo "  Status: ${TEST_HTTP_CODE}"
    echo ""
    
    # Step 4: Next Steps
    if [ "$HTTP_CODE" = "200" ] && [ "$TEST_HTTP_CODE" = "200" ]; then
        print_success "All checks passed! Builder.io integration is working."
        echo ""
        print_info "Proof files saved:"
        echo "  - Health response: /tmp/health-response.json"
        echo "  - Test page HTML: /tmp/test-page.html"
        echo ""
    else
        print_warning "Some checks did not pass. See details above."
        echo ""
        print_info "For detailed troubleshooting, see:"
        echo "  - VERIFICATION_QUICK_START.md"
        echo "  - BUILDER_IO_FORENSIC_VERIFICATION.md"
        echo ""
    fi
}

###############################################################################
# Run Main
###############################################################################

main "$@"
