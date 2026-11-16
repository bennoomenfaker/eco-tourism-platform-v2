import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Le front et l'API sont servis par le même Caddy. Ce rewrite sert de filet
  // quand on ouvre directement le conteneur web (port 3004) : /api part alors
  // vers le service `api` du réseau Docker au lieu de renvoyer 404.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: "http://api:3000/api/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
