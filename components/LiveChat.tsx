import Script from 'next/script';

export default function LiveChat() {
  return (
    <>
      <Script
        src="https://client.crisp.chat/l.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error Crisp chat library
          if (window.$crisp) {
            // @ts-expect-error Crisp chat library
            window.$crisp.push(['config', 'website:id', 'amanuel-travel-support']);
          }
        }}
      />
    </>
  );
}
