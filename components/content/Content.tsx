import CustomMarkdown from 'components/CustomMarkdown';
import Image from 'next/image';
import TextReveal from '@/components/text-reveal/TextReveal';
import StackingCards from '@/components/stacking-cards/StackingCards';

function Content(props) {
  const dynamicZone = props.data.dynamicZone;

  return (
    <>
      {dynamicZone?.map((component, index) => {
        switch (component.__component) {
          case 'slices.text': {
            const classes = component.class
              ? component.class.split(' ').join(' ')
              : '';

            return (
              <div className={`textSection ${classes}`} key={index}>
                <TextReveal line>
                  <CustomMarkdown key={index}>
                    {component.Content}
                  </CustomMarkdown>
                </TextReveal>
              </div>
            );
          }

          case 'slices.stacking-cards': {
            return <StackingCards data={component.items} key={index} />;
          }

          case 'slices.two-columns-text': {
            return (
              <div className={`twoColumnsText`} key={index}>
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
            return (
              <div className="twoImages" key={index}>
                <Image
                  src={
                    component.firstImage?.data?.attributes.formats.medium
                      ?.url || component.firstImage.data?.attributes.url
                  }
                  alt={
                    component.firstImage.data?.attributes.alternativeText || ''
                  }
                  width={
                    component.firstImage.data?.attributes.formats.medium
                      ?.width || component.firstImage.data?.attributes.width
                  }
                  height={
                    component.firstImage.data?.attributes.formats.medium
                      ?.height || component.firstImage.data?.attributes.height
                  }
                  quality={100}
                />
                <Image
                  src={
                    component.secondImage?.data?.attributes.formats.medium
                      ?.url || component.secondImage.data?.attributes.url
                  }
                  alt={
                    component.secondImage.data?.attributes.alternativeText || ''
                  }
                  width={
                    component.secondImage.data?.attributes.formats.medium
                      ?.width || component.secondImage.data?.attributes.width
                  }
                  height={
                    component.secondImage.data?.attributes.formats.medium
                      ?.height || component.secondImage.data?.attributes.height
                  }
                  quality={100}
                />
              </div>
            );
          }
          case 'slices.youtube-video': {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${component.url}?controls=0&showinfo=0&modestbranding=1`}
                title={props.data.title}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                key={index}
              ></iframe>
            );
          }
          case 'slices.single-media':
            if (component.media.data) {
              if (component.media.data?.attributes.mime.startsWith('video/')) {
                return (
                  <video
                    autoPlay
                    muted
                    loop
                    key={index}
                    className={`staticVideo`}
                  >
                    <source
                      src={component.media.data.attributes.url}
                      type={component.media.data.attributes.mime}
                    />
                  </video>
                );
              } else {
                const classes = component.class
                  ? component.class.split(' ').join(' ')
                  : '';

                return (
                  <div key={index} className={`${classes} staticImage`}>
                    <Image
                      src={
                        component.media.data?.attributes.formats.large?.url ||
                        component.media.data?.attributes.url
                      }
                      alt={
                        component.media.data?.attributes.alternativeText || ''
                      }
                      width={
                        component.media.data?.attributes.formats.large?.width ||
                        component.media.data?.attributes.width
                      }
                      height={
                        component.media.data?.attributes.formats.large
                          ?.height || component.media.data?.attributes.height
                      }
                      quality={100}
                    />
                  </div>
                );
              }
            }
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}

export default Content;
