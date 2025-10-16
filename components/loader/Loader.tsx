import Image from 'next/image';

const Default = () => {
  return (
    <div className="loaderAbsolute">
      <div className="loaderAbsolute_inner">
        <Image
          src="/images/Alpine-loading.gif"
          alt="Alpine loading gif"
          width={120}
          height={120}
          unoptimized
        />
      </div>
    </div>
  );
};

export default Default;
