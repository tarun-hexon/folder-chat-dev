import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const darkModeAtom = atomWithStorage('darkMode', false)
export const sessionAtom = atom(null);
export const isPostSignUpCompleteAtom = atom(false);
export const isPostNameCompleteAtom = atom(false);
export const isPostUserCompleteAtom = atom(false);
export const allowSessionAtom = atom(false);
export const folderAtom = atom([]);
export const folderAddedAtom = atom(false);
export const folderIdAtom = atom('');
export const showAdvanceAtom = atom(false);
export const chatHistoryAtom = atom({});
export const chatSessionIDAtom = atom('new')
export const userConnectorsAtom = atom(null);
export const existConnectorDetailsAtom = atom([])
export const chatTitleAtom = atom('')
export const documentSetAtom = atom([]);
export const allIndexingConnectorAtom = atom(null)
export const selectOptionAtom = atom([
    {
        name:'option_1',
        value:'1'
    },
    {
        name:'option_2',
        value:'1'
    },
    {
        name:'option_3',
        value:'1'
    },
    {
        name:'option_4',
        value:'1'
    }
]);