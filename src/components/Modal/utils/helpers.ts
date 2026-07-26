const modalStack: string[] = [];

export function pushModal(id: string) {
  const idx = modalStack.indexOf(id);
  if (idx !== -1) modalStack.splice(idx, 1);
  modalStack.push(id);
}

export function popModal(id: string) {
  const idx = modalStack.indexOf(id);
  if (idx !== -1) modalStack.splice(idx, 1);
}

export function isTopModal(id: string): boolean {
  return modalStack.length > 0 && modalStack[modalStack.length - 1] === id;
}
