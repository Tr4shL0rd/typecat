const world = 'World';
export function hello(who: string = world): string {
  return `Hello ${who}`;
}
