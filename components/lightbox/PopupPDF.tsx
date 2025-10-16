import { useState, useEffect, useRef } from 'react';
import { setCookie, getCookie } from 'cookies-next';

import dynamic from 'next/dynamic';
const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
});

interface PdfUrl {
  url: string;
  name: string;
  password?: string;
  id?: string;
}

interface PopupPDFProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: PdfUrl | null;
}

const PopupPDF = ({ isOpen, onClose, pdfUrl }: PopupPDFProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Extract password from pdfUrl if it exists
  const password = pdfUrl?.password;

  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isMounted) {
      if (isOpen) {
        document.body.style.marginRight =
          window.innerWidth - document.body.offsetWidth + 'px';
        document.body.classList.add('no-scroll');

        // Check for saved password in cookies if a password is required
        if (password) {
          const savedPasswordKey = `pdf_protected_${pdfUrl.id || ''}`;
          const savedPassword = getCookie(savedPasswordKey);
          if (savedPassword) {
            setIsPasswordVerified(true);
          }
        }
      } else {
        document.body.style.marginRight = '0';
        document.body.classList.remove('no-scroll');
        // Reset password state when closing the popup
        setInputPassword('');
        setIsPasswordVerified(false);
        setPasswordError('');
      }
    }
  }, [isOpen, isMounted, password, pdfUrl]);

  function getSafariVersion() {
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    return versionMatch ? versionMatch[1] : null;
  }

  const safariVersion = getSafariVersion();
  const isSupportedBrowser = !safariVersion || parseFloat(safariVersion) >= 16;

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // console.error('Error downloading file:', error);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputPassword === password) {
      setIsPasswordVerified(true);
      setPasswordError('');

      // Save password to cookie
      const passwordKey = `pdf_protected_${pdfUrl?.id || ''}`;
      setCookie(passwordKey, 'verified', { maxAge: 60 * 60 * 24 * 365 }); // 365 days
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const renderPasswordForm = () => {
    return (
      <div className="modal-password">
        <h3>This document is password protected</h3>
        <h4>
          <a href="mailto:sales@alpinearmoring.com">
            (Contact Us for the password)
          </a>
        </h4>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password"
              className={`password-input ${passwordError ? 'error' : ''}`}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button type="submit" className="submit-button">
            Unlock Document
          </button>
        </form>
      </div>
    );
  };

  const shouldShowPasswordForm = password && !isPasswordVerified;

  return (
    <>
      {isOpen && pdfUrl && (
        <div
          ref={popupRef}
          className={`modal modal_pdf ${isOpen ? 'modal_active' : ''}`}
          onClick={onClose}
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="modal_nav">
              {(!password || isPasswordVerified) && (
                <button
                  onClick={() => handleDownload(pdfUrl.url, pdfUrl.name)}
                  className={`modal_download`}
                >
                  <svg
                    fill="#000000"
                    height="28px"
                    width="28px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 29.978 29.978"
                  >
                    <g>
                      <path
                        d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012
                                v-8.861H25.462z"
                      />
                      <path
                        d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723
                                c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742
                                c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193
                                C15.092,18.979,14.62,18.426,14.62,18.426z"
                      />
                    </g>
                  </svg>
                </button>
              )}

              <button className={`modal_close`} onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="#fff"
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>

            {shouldShowPasswordForm ? (
              renderPasswordForm()
            ) : isSupportedBrowser ? (
              <PdfViewer pdfUrl={pdfUrl.url} />
            ) : (
              <div style={{ overflow: 'scroll' }}>
                <embed src={pdfUrl.url} width="100%" height="100%" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupPDF;
