import Script from 'next/script';

declare global {
  interface Window {
    $crisp: Record<string, unknown>;
  }
}

// SETUP INSTRUCTIONS:
// 1. Create a Crisp account at https://crisp.chat
// 2. Get your Website ID from: Settings > Integrations > Crisp Chat
// 3. Add to .env.local: NEXT_PUBLIC_CRISP_WEBSITE_ID=your_actual_id
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'amanuel-travel-support';

export default function LiveChat() {
  return (
    <>
      <Script
        src="https://client.crisp.chat/l.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.$crisp) {
            window.$crisp.push(['config', 'website:id', CRISP_WEBSITE_ID]);
            // Customize appearance (emerald-600)
            window.$crisp.push(['config', 'color:theme', '#059669']);
          }
        }}
      />
    </>
  );
}
