export class PieceSet {
  public static HORSEY = new PieceSet('Horsey', '/assets/piece/horsey');

  constructor(
    public readonly name: string,
    public readonly path: string
  ) {}
}
