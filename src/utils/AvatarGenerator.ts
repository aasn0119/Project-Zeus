export default function AvatarGenerator(text?: string) {
  // TODO: Implement random text generator here to generate random images...!
  return `https://api.multiavatar.com/${text || "random"}.png`;
}
