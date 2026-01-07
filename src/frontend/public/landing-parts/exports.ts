export const landingExports = `
        return {
            StudentLanding,
            StudentRegister, // <--- ADDED THIS
            SubjectIndexPage,
            PublicBanglaShell,
            PublicBanglaTopicGrid,
            PublicBanglaTextList,
            PublicBanglaShohopathList,
            PublicBanglaItemDetail,
            PublicBanglaSrijonshilDetail,
            PublicBanglaMcqDetail,
            PublicIctShell,
            PublicIctChapterList,
            PublicIctMcqDetail,
            PublicScienceShell,
            PublicScienceChapterList,
            PublicScienceTopicList,
            PublicScienceTopicDetail,
            PublicScienceCqDetail,
            PublicScienceMcqDetail,
            PublicVideoList,
            PublicVideoDetail,
            PublicReligionOptionList,
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects,
            religionOptions
        };
        })();
        
        // Destructure it here too so the View can see it
        const {
            StudentLanding, StudentRegister, SubjectIndexPage, PublicBanglaShell, PublicBanglaTopicGrid, PublicBanglaTextList,
            PublicBanglaShohopathList, PublicBanglaItemDetail, PublicBanglaSrijonshilDetail, PublicBanglaMcqDetail,
            PublicIctShell, PublicIctChapterList, PublicIctMcqDetail, PublicScienceShell, PublicScienceChapterList,
            PublicScienceTopicList, PublicScienceTopicDetail, PublicScienceCqDetail, PublicScienceMcqDetail,
            PublicVideoList, PublicVideoDetail, PublicReligionOptionList, PublicEnglishShell, PublicEnglishCardGrid,
            PublicEnglishTypeList, PublicEnglishQuestionList, sscSubjects, hscSubjects, religionOptions
        } = LandingModule;
`;
