import WhatsAppIcon from './WhatsAppIcon';

const WHATSAPP_URL =
  'https://wa.me/447899001900?text=Hello%20My%20Airport%20Taxis%2C%20I%20need%20help%20with%20a%20booking.';

const ChatWithUs = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-green-200 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
  >
    <WhatsAppIcon className="h-6 w-6 shrink-0" />
    <span className="whitespace-nowrap text-sm sm:text-base">Chat with us</span>
  </a>
);

export default ChatWithUs;
