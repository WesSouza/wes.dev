let shared: ProgramManager | undefined;

export class ProgramManager {
  static get shared() {
    if (!shared) {
      shared = new ProgramManager();
    }

    return shared;
  }

  programs = new Map<string, unknown>();

  constructor() {}
}
