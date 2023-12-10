import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const darkModeAtom = atomWithStorage('darkMode', false)
export const sessionAtom = atom(null);

export const isPostSignUpCompleteAtom = atom(false);
export const isPostNameCompleteAtom = atom(false);
export const isPostUserCompleteAtom = atom(false);
export const allowSessionAtom = atom(false);
export const onBoardCompleteAtom = atomWithStorage('onBoard', false);
