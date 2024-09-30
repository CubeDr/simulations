import Point from './Point';
import Rectangle from './Rectangle';

export default class Quadtree {
  boundary: Rectangle;
  capacity: number;
  points: Point[];
  divided: boolean;
  northwest: Quadtree | null;
  northeast: Quadtree | null;
  southwest: Quadtree | null;
  southeast: Quadtree | null;

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.northwest = null;
    this.northeast = null;
    this.southwest = null;
    this.southeast = null;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let nw = new Rectangle(x, y, w, h);
    this.northwest = new Quadtree(nw, this.capacity);
    let ne = new Rectangle(x + w, y, w, h);
    this.northeast = new Quadtree(ne, this.capacity);
    let sw = new Rectangle(x, y + h, w, h);
    this.southwest = new Quadtree(sw, this.capacity);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new Quadtree(se, this.capacity);
    this.divided = true;
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northwest!.insert(point)) return true;
      if (this.northeast!.insert(point)) return true;
      if (this.southwest!.insert(point)) return true;
      if (this.southeast!.insert(point)) return true;

      return false;
    }
  }

  query(range: Rectangle, found: Point[] = []): Point[] {
    if (!this.boundary.intersects(range)) {
      return [];
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest!.query(range, found);
        this.northeast!.query(range, found);
        this.southwest!.query(range, found);
        this.southeast!.query(range, found);
      }
      return found;
    }
  }
}
