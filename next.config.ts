import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    prependData: `@use './styles/_mixins.scss' as *;`,
  },
};

export default nextConfig;
