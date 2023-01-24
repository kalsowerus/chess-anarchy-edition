import { Position } from 'types/position';

export function* range(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export function containsPosition(array: Position[], position: Position): boolean {
  return array.find(item => item.equals(position)) != null;
}
