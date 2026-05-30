const viteBaseUrl = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";

export function getPublicAssetUrl(assetName: string, baseUrl = viteBaseUrl) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedAsset = assetName.startsWith("/") ? assetName.slice(1) : assetName;

  return `${normalizedBase}${normalizedAsset}`;
}
