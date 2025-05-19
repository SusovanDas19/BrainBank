import { selector } from "recoil";
import { ResponseStr } from "../../Components/Tabs/Youtube";
import { ShareBrainDataAtom } from "../atoms/shareBrainDataAtom";

const mainSlector = (type: ResponseStr['type']) => {
    return selector<ResponseStr[]>({
      key: `ShareBrain_${type}_Selector`,
      get: ({ get }) => get(ShareBrainDataAtom).filter(p => p.type === type),
    });
  };

export const YoutubeSharedSelector = mainSlector("Youtube");
export const TwitterSharedSelector = mainSlector("Twitter");
export const LinkedinSharedSelector = mainSlector("Linkedin");
export const NotionSharedSelector = mainSlector("Notion");
export const GithubSharedSelector = mainSlector("Github");
export const AichatSharedSelector = mainSlector("Aichat");
export const RandomSharedSelector = mainSlector("Random");
export const NotesSharedSelector = mainSlector("Notes");
