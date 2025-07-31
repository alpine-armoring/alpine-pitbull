import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function CustomMarkdown({ children }) {
  const openPopupWindow = useCallback((url) => {
    const width = Math.min(1500, window.innerWidth * 0.8);
    const height = Math.min(1000, window.innerHeight * 0.8);

    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      url,
      `popup_${Date.now()}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes`
    );
  }, []);

  const components = {
    a: ({ href, children, ...props }) => {
      const isExternal =
        href &&
        (href.startsWith('http') ||
          href.startsWith('www') ||
          href.startsWith('//'));

      if (isExternal) {
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              openPopupWindow(
                href,
                typeof children[0] === 'string'
                  ? children[0]
                  : 'External Content'
              );
            }}
            className="external-link"
            data-external="true"
            rel="nofollow noopener noreferrer"
            aria-label={`${typeof children[0] === 'string' ? children[0] : 'Link'} (opens in popup window)`}
            {...props}
          >
            {children}
          </a>
        );
      }

      // For internal links, use default behavior
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
  };

  if (!children) return null;

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
