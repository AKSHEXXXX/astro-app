import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      {/* Pre-footer CTA band */}
      <div className="prefooter">
        <div className="container prefooter__inner">
          <h2 className="prefooter__title">{t('footer.preTitle')}</h2>
          <a href="#prediction" className="btn-gold btn-gold-filled">{t('footer.bookFree')}</a>
        </div>
      </div>

      <footer id="contact" className="footer" role="contentinfo">
        <div className="container footer__grid">
          {/* Col 1 */}
          <div className="footer__col">
            <div className="footer__logo">🌙 Shree Ayush Saxena</div>
            <p className="footer__tagline">{t('footer.tagline')}</p>
          </div>

          {/* Col 2 */}
          <div className="footer__col">
            <h4 className="footer__col-title">{t('footer.links')}</h4>
            <nav aria-label="Footer navigation">
              {['#home','#about','#prediction','#services','#contact'].map((h, i) => (
                <a key={h} href={h} className="footer__link">
                  {t(`nav.${['home','about','prediction','services','contact'][i]}`)}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 */}
          <div className="footer__col">
            <h4 className="footer__col-title">{t('footer.contact')}</h4>
            <a href="mailto:ayush@cosmicguidance.in" className="footer__link">
              ✉ ayush@cosmicguidance.in
            </a>
            <a
              href="https://wa.me/919876543210?text=Namaste%20Ayush%20Ji%2C%20I%20would%20like%20to%20book%20a%20consultation"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              📱 WhatsApp Us
            </a>
            <a href="https://instagram.com" className="footer__link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              📸 Instagram
            </a>
            <a href="https://facebook.com" className="footer__link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              📘 Facebook
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__bottom-inner">
            <p>© 2025 Shree Ayush Saxena. {t('footer.rights')}</p>
            <div className="footer__bottom-links">
              <button className="footer__policy-btn" onClick={() => document.getElementById('privacy-modal').showModal()}>{t('footer.privacy')}</button>
              <span>·</span>
              <button className="footer__policy-btn" onClick={() => document.getElementById('terms-modal').showModal()}>{t('footer.terms')}</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <dialog id="privacy-modal" className="policy-dialog">
        <button className="policy-dialog__close" onClick={() => document.getElementById('privacy-modal').close()} aria-label="Close">✕</button>
        <h2>{t('footer.privacy')}</h2>
        <p>{t('footer.privacyText')}</p>
        <p style={{marginTop:'1rem'}}>Last updated: January 2025.</p>
      </dialog>

      {/* Terms Modal */}
      <dialog id="terms-modal" className="policy-dialog">
        <button className="policy-dialog__close" onClick={() => document.getElementById('terms-modal').close()} aria-label="Close">✕</button>
        <h2>{t('footer.terms')}</h2>
        <p>{t('footer.termsText')}</p>
        <p style={{marginTop:'1rem'}}>Last updated: January 2025.</p>
      </dialog>
    </>
  );
}
