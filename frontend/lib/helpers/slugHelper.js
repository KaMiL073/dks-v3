export default function slug(url) {
  return url.toLowerCase().replace(/\s+/, '-').replace('é', 'e');
}
