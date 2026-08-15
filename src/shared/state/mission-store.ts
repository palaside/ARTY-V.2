export function createMissionStore() {
  return {
    missionId: null as string | null,
    status: 'idle' as 'idle' | 'active' | 'complete',
  };
}
