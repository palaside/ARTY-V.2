export interface ActiveTarget {
  id: string;
  easting: number;
  northing: number;
  altitude: number;
}

export function createTargetStore() {
  return {
    activeTarget: null as ActiveTarget | null,
    setActiveTarget(target: ActiveTarget) {
      this.activeTarget = target;
    },
  };
}
