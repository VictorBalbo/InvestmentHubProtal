export class ColorService {
  private static getHashFromString(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    return hash;
  }
  public static getColor(value: string): string {
    const hash = this.getHashFromString(value);
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      color += value.toString(16);
    }
    return color;
  }
}
