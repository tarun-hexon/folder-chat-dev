import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const darkModeAtom = atomWithStorage('darkMode', true)
export const sessionAtom = atom(null);
export const isPostSignUpCompleteAtom = atom(false);
export const isPostNameCompleteAtom = atom(false);
export const isPostUserCompleteAtom = atom(false);
export const allowSessionAtom = atom(false);
export const folderAtom = atom([{title:'Folder 1'}]);
export const fileNameAtom = atom('Document 001.pdf')