import CustomMarkdown from 'components/CustomMarkdown';
import Image from 'next/image';
import StackingCards from '@/components/stacking-cards/StackingCards';
import FadeInContent from '@/components/FadeInContent';
import ParallaxElement from '@/components/ParallaxElement';
import StickySections from '@/components/sticky-sections/StickySections';
import Timeline from '@/components/timeline/Timeline';

function Content(props) {
  const dynamicZone = props.data.dynamicZone;

  // Helper function to extract parallax settings from classes
  const getParallaxSettings = (classes) => {
    const hasParallax = classes.includes('parallax');
    let parallaxSpeed = 0.3; // default speed

    if (hasParallax) {
      const speedMatch = classes.match(/parallax-([0-9]+\.?[0-9]*)/);
      if (speedMatch) {
        parallaxSpeed = parseFloat(speedMatch[1]);
      }
    }

    return { hasParallax, parallaxSpeed };
  };

  // Helper function to wrap content with parallax if needed
  const withParallax = (content, classes, index, defaultClassName = '') => {
    const { hasParallax, parallaxSpeed } = getParallaxSettings(classes);

    if (hasParallax) {
      return (
        <ParallaxElement
          key={index}
          className={defaultClassName}
          speed={parallaxSpeed}
        >
          {content}
        </ParallaxElement>
      );
    }

    // Return wrapped in div with className when no parallax
    return (
      <div className={defaultClassName} key={index}>
        {content}
      </div>
    );
  };

  return (
    <>
      {dynamicZone?.map((component, index) => {
        const classes = component.class
          ? component.class.split(' ').join(' ')
          : '';

        switch (component.__component) {
          case 'slices.text': {
            const textContent = (
              <div className={`static ${classes} container_small`} key={index}>
                <FadeInContent>
                  <CustomMarkdown>{component.Content}</CustomMarkdown>
                </FadeInContent>
              </div>
            );

            const { hasParallax } = getParallaxSettings(classes);
            if (hasParallax) {
              return withParallax(
                <FadeInContent>
                  <CustomMarkdown>{component.Content}</CustomMarkdown>
                </FadeInContent>,
                classes,
                index,
                `static ${classes}`
              );
            }

            return textContent;
          }

          case 'slices.stacking-cards': {
            return <StackingCards data={component.items} key={index} />;
          }

          case 'slices.sticky-sections': {
            return (
              <StickySections
                data={component.item}
                media={component.media}
                text={component.text}
                key={index}
              />
            );
          }

          case 'slices.spacing': {
            return (
              <div
                className={`spacing static ${classes}`}
                key={index}
                id={`${component.anchor ? component.anchor : ''}`}
              >
                {' '}
              </div>
            );
          }

          case 'slices.two-columns-text': {
            return (
              <div
                className={`${classes} twoColumnsText static container_small`}
                key={index}
              >
                <div>
                  <CustomMarkdown>{component.leftText}</CustomMarkdown>
                </div>
                <div>
                  <CustomMarkdown>{component.rightText}</CustomMarkdown>
                </div>
              </div>
            );
          }

          case 'slices.two-images': {
            // Helper function to check if value is a YouTube ID string
            const isYouTubeId = (value): boolean => {
              return (
                typeof value === 'string' &&
                value.length === 11 &&
                /^[A-Za-z0-9_-]+$/.test(value)
              );
            };

            // Helper function to render media item (image or YouTube video)
            const renderMediaItem = (imageData, youtubeId, index: number) => {
              // Check if YouTube video ID is provided
              if (youtubeId && isYouTubeId(youtubeId)) {
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?controls=0&showinfo=0&modestbranding=1`}
                    title={`YouTube video ${index}`}
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                    className="twoImages-youtube"
                  />
                );
              }

              // Render as image if image data exists
              if (imageData?.data) {
                return (
                  <Image
                    src={
                      imageData.data.attributes.formats.medium?.url ||
                      imageData.data.attributes.url
                    }
                    alt={imageData.data.attributes.alternativeText || ''}
                    width={
                      imageData.data.attributes.formats.medium?.width ||
                      imageData.data.attributes.width
                    }
                    height={
                      imageData.data.attributes.formats.medium?.height ||
                      imageData.data.attributes.height
                    }
                    quality={100}
                  />
                );
              }

              return null;
            };

            return (
              <div className="twoImages" key={index}>
                {renderMediaItem(component.firstImage, component.ytVideo1, 1)}
                {renderMediaItem(component.secondImage, component.ytVideo2, 2)}
              </div>
            );
          }

          case 'slices.repeatable-component': {
            return <Timeline key={index} data={component.timeline} />;
          }

          case 'slices.youtube-video': {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${component.url}?controls=0&showinfo=0&modestbranding=1`}
                title={component.title || 'YouTube video'}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                key={index}
                className={`staticIframe ${classes}`}
              ></iframe>
            );
          }

          case 'slices.single-media': {
            if (!component.media.data) return null;

            if (component.media.data?.attributes.mime.startsWith('video/')) {
              const videoContent = (
                <video autoPlay muted loop>
                  <source
                    src={component.media.data.attributes.url}
                    type={component.media.data.attributes.mime}
                  />
                </video>
              );

              return withParallax(videoContent, classes, index, 'staticVideo');
            } else {
              const imageContent = (
                <Image
                  src={
                    component.media.data?.attributes?.formats?.large?.url ||
                    component.media.data?.attributes.url
                  }
                  alt={component.media.data?.attributes.alternativeText || ''}
                  width={
                    component.media.data?.attributes?.formats?.large?.width ||
                    component.media.data?.attributes.width
                  }
                  height={
                    component.media.data?.attributes?.formats?.large?.height ||
                    component.media.data?.attributes.height
                  }
                  quality={100}
                />
              );

              return withParallax(
                imageContent,
                classes,
                index,
                `${classes} staticImage`
              );
            }
          }

          default:
            return null;
        }
      })}
    </>
  );
}

export default Content;
