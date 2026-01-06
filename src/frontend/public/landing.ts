


import { StudentLandingComponent } from "../components/public/StudentLanding";
import { PublicVideoListComponent } from "../components/public/PublicVideoList";
import { PublicVideoDetailComponent } from "../components/public/PublicVideoDetail";
import { SubjectIndexPageComponent } from "../components/public/SubjectIndexPage";
import { PublicEnglishQuestionList } from "../components/public/PublicEnglishQuestionList";
import { useVideoProgress } from "../components/public/useVideoProgress";
import { useReadingProgress } from "../components/public/useReadingProgress";
import { subjectGroups } from "../components/public/subjectGroups";
import { buildSubjectList } from "../components/public/buildSubjectList";
import { useThumbnails } from "../components/public/useThumbnails";
import { loadVideoProgress } from "../components/public/loadVideoProgress";
import { loadRecentVideo } from "../components/public/loadRecentVideo";
import { storeVideoProgress } from "../components/public/storeVideoProgress";
import { loadReadProgress } from "../components/public/loadReadProgress";
import { loadRecentRead } from "../components/public/loadRecentRead";
import { storeReadProgress } from "../components/public/storeReadProgress";
import { storeBanglaSelection } from "../components/public/storeBanglaSelection";
import { getLastReadForSubject } from "../components/public/getLastReadForSubject";
import { getSubjectChapterCount } from "../components/public/getSubjectChapterCount";
import { ArtPanelGrid } from "../components/public/ArtPanelGrid";
import { SubjectCard } from "../components/public/SubjectCard";
import { ChapterCard } from "../components/public/ChapterCard";
import { PublicChapterList } from "../components/public/PublicChapterList";
import { SubjectRow } from "../components/public/SubjectRow";
import { formatHierarchyLabel } from "../components/public/formatHierarchyLabel";
import { buildHierarchyTrail } from "../components/public/buildHierarchyTrail";
import { PublicSidebar } from "../components/public/PublicSidebar";
import { PublicBanglaShell } from "../components/public/PublicBanglaShell";
import { PublicSimpleShell } from "../components/public/PublicSimpleShell";
import { PublicBanglaTopicGrid } from "../components/public/PublicBanglaTopicGrid";
import { PublicBanglaTextList } from "../components/public/PublicBanglaTextList";
import { PublicBanglaShohopathList } from "../components/public/PublicBanglaShohopathList";
import { CqQuestionList } from "../components/public/CqQuestionList";
import { PublicBanglaItemDetail } from "../components/public/PublicBanglaItemDetail";
import { PublicBanglaSrijonshilDetail } from "../components/public/PublicBanglaSrijonshilDetail";
import { PublicMcqList } from "../components/public/PublicMcqList";
import { PublicBanglaMcqDetail } from "../components/public/PublicBanglaMcqDetail";
import { PublicIctShell } from "../components/public/PublicIctShell";
import { PublicIctMcqDetail } from "../components/public/PublicIctMcqDetail";
import { PublicScienceShell } from "../components/public/PublicScienceShell";
import { PublicReligionOptionList } from "../components/public/PublicReligionOptionList";
import { PublicScienceTopicList } from "../components/public/PublicScienceTopicList";
import { PublicScienceTopicDetail } from "../components/public/PublicScienceTopicDetail";
import { PublicScienceCqDetail } from "../components/public/PublicScienceCqDetail";
import { PublicScienceMcqDetail } from "../components/public/PublicScienceMcqDetail";
import { PublicVideoPlayer } from "../components/public/PublicVideoPlayer";
import { PublicEnglishCardGrid } from "../components/public/PublicEnglishCardGrid";
import { PublicEnglishTypeList } from "../components/public/PublicEnglishTypeList";
import { scienceConfigs } from "../components/public/scienceConfigs";
import { addBanglaItems } from "../components/public/addBanglaItems";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";
import { } from "../components/public/";

    // If you had other components like PublicScienceShell, PublicIctShell inside landing.ts, 
    // you should extract them similarly. For now, assuming they are defined elsewhere or 
    // included in the chunks you just moved, we will concatenate them.
    // However, since we are using string concatenation for the final output, 
    // we just need to import the strings.
 // This line is just to show structure.

// We combine the strings of the components we extracted.
// If there are other components (like shells/lists) still needed that we haven't extracted yet,
// you might need to keep them here temporarily or extract them too.

export const landingComponents = `
${StudentLandingComponent}
${PublicVideoListComponent}
${PublicVideoDetailComponent}
${SubjectIndexPageComponent}
${PublicEnglishQuestionList}
${useVideoProgress}
${useReadingProgress}
${subjectGroups}
${buildSubjectList}
${useThumbnails}
${loadVideoProgress}
${loadRecentVideo}
${storeVideoProgress}
${loadReadProgress}
${loadRecentRead}
${storeReadProgress}
${storeBanglaSelection}
${getLastReadForSubject}
${getSubjectChapterCount}
${ArtPanelGrid}
${SubjectCard}
${ChapterCard}
${PublicChapterList}
${SubjectRow}
${formatHierarchyLabel}
${buildHierarchyTrail}
${PublicSidebar}
${PublicBanglaShell}
${PublicSimpleShell}
${PublicBanglaTopicGrid}
${PublicBanglaTextList}
${PublicBanglaShohopathList}
${CqQuestionList}
${PublicBanglaItemDetail}
${PublicBanglaSrijonshilDetail}
${PublicMcqList}
${PublicBanglaMcqDetail}
${PublicIctShell}
${PublicIctMcqDetail}
${PublicScienceShell}
${PublicReligionOptionList}
${PublicScienceTopicList}
${PublicScienceTopicDetail}
${PublicScienceCqDetail}
${PublicScienceMcqDetail}
${PublicVideoPlayer}
${PublicEnglishCardGrid}
${PublicEnglishTypeList}
${scienceConfigs}
${addBanglaItems}

// You might need to add other minor components here if they were defined in the original file 
// and are not covered by the 4 files above.
// For example: PublicScienceShell, PublicIctShell, etc.
// If you see errors about missing components, create new files for them using the same pattern.
`;














export const landingComponents = `
        const LandingModule = (() => {
        const quoteItems = [
            { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
            { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
            { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
            { text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats' },
            { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
            { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', author: 'Malcolm X' },
            { text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
            { text: 'Knowledge will bring you the opportunity to make a difference.', author: 'Claire Fagin' },
            { text: 'The purpose of education is to replace an empty mind with an open one.', author: 'Malcolm Forbes' },
            { text: 'We serve others best when we empower them to learn for themselves.', author: 'Education proverb' }
        ];

      
        const subjectIconMap = {
            'Bangla 1st Paper': 'fa-book-open',
            'Bangla 2nd Paper': 'fa-book',
            'English 1st Paper': 'fa-language',
            'English 2nd Paper': 'fa-pen-nib',
            'General Mathematics': 'fa-calculator',
            Mathematics: 'fa-calculator',
            Physics: 'fa-atom',
            Chemistry: 'fa-flask',
            Biology: 'fa-dna',
            'Higher Mathematics': 'fa-square-root-variable',
            'Higher Mathematics 1st Paper': 'fa-square-root-variable',
            'Higher Mathematics 2nd Paper': 'fa-square-root-variable',
            'Bangladesh and Global Studies': 'fa-globe',
            'Information and Communication Technology': 'fa-laptop-code',
            Religion: 'fa-hands-praying',
            'Religion and Moral Education': 'fa-hands-praying',
            'Geography and Environment': 'fa-mountain-sun',
            'History of Bangladesh and World Civilization': 'fa-landmark',
            'Civics and Citizenship': 'fa-scale-balanced',
            Accounting: 'fa-receipt',
            'Business Entrepreneurship': 'fa-briefcase',
            'Finance and Banking': 'fa-coins',
            'Physics 1st Paper': 'fa-atom',
            'Physics 2nd Paper': 'fa-atom',
            'Chemistry 1st Paper': 'fa-flask',
            'Chemistry 2nd Paper': 'fa-flask',
            'Biology 1st Paper': 'fa-dna',
            'Biology 2nd Paper': 'fa-dna',
            'Economics 1st Paper': 'fa-chart-line',
            'Economics 2nd Paper': 'fa-chart-line',
            'History 1st Paper': 'fa-landmark',
            'History 2nd Paper': 'fa-landmark',
            'Civics and Good Governance 1st Paper': 'fa-scale-balanced',
            'Civics and Good Governance 2nd Paper': 'fa-scale-balanced',
            'Logic 1st Paper': 'fa-lightbulb',
            'Logic 2nd Paper': 'fa-lightbulb',
            'Accounting 1st Paper': 'fa-receipt',
            'Accounting 2nd Paper': 'fa-receipt',
            'Business Organization and Management 1st Paper': 'fa-briefcase',
            'Business Organization and Management 2nd Paper': 'fa-briefcase',
            'Finance, Banking and Insurance 1st Paper': 'fa-coins',
            'Finance, Banking and Insurance 2nd Paper': 'fa-coins',
            'Production Management and Marketing 1st Paper': 'fa-industry',
            'Production Management and Marketing 2nd Paper': 'fa-industry'
        };

        const accentPalette = [
            'bg-sky-500',
            'bg-indigo-500',
            'bg-emerald-500',
            'bg-rose-500',
            'bg-amber-500',
            'bg-violet-500',
            'bg-teal-500'
        ];
        

        const sscSubjects = buildSubjectList('SSC');
        const hscSubjects = buildSubjectList('HSC');
        const sscFeaturedSubjects = sscSubjects.slice(0, 8);
        const hscFeaturedSubjects = hscSubjects.slice(0, 8);
        const religionOptions = [
            { key: 'Islam', label: 'Islam', subtitle: 'ইসলাম' },
            { key: 'Hinduism', label: 'Hinduism', subtitle: 'হিন্দু ধর্ম' },
            { key: 'Buddhism', label: 'Buddhism', subtitle: 'বৌদ্ধ ধর্ম' },
            { key: 'Christianity', label: 'Christianity', subtitle: 'খ্রিষ্টান ধর্ম' }
        ];

        

        const READ_PROGRESS_KEY = 'freeducation.read-progress';
        const RECENT_READ_KEY = 'freeducation.recent-read';
        const VIDEO_PROGRESS_KEY = 'freeducation.video-progress';
        const RECENT_VIDEO_KEY = 'freeducation.recent-video';
        const cardWidthClass = 'w-36 sm:w-40 md:w-44';
        const cardGridGapClass = 'gap-2 sm:gap-4';
        const cardSurfaceClass =
            'relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 bg-white transition group-hover:border-indigo-200 card-art-surface';
        const cardPanelClass = 'relative';
        const flatSectionClass = 'border-b border-slate-200 pb-4 last:border-b-0';



        const PublicIctChapterList = (props) => <PublicChapterList {...props} />;
        
        const PublicScienceChapterList = (props) => <PublicChapterList {...props} />;

























       

        

        



        const formatDuration = (value) => {
            if (value === null || value === undefined) return '';
            const total = Math.floor(Number(value));
            if (Number.isNaN(total)) return '';
            const minutes = Math.floor(total / 60);
            const seconds = total % 60;
            return String(minutes) + ':' + String(seconds).padStart(2, '0');
        };

        const getYoutubeEmbedUrl = (url) => {
            if (!url) return '';
            const match = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([\\w-]+)/);
            return match ? 'https://www.youtube.com/embed/' + match[1] : '';
        };

        const getVideoSource = (video) => {
            if (!video) return '';
            if (video.sourceType === 'upload') {
                return video.url || (video.fileKey ? '/api/videos/' + encodeURIComponent(video.fileKey) : '');
            }
            return video.url || '';
        };


















        
       
       

       

        

      
       
               

                scienceConfigs.forEach((config) => {
                    (config.chapters || []).forEach((chapter) => {
                        addEntry({
                            type: 'Chapter',
                            title: chapter.name,
                            subtitle: config.subjectLabel + ' • ' + config.classLabel,
                            keywords: [chapter.name, config.subjectLabel, config.classLabel, 'chapter'].join(' '),
                            onSelect: () => {
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: config.classLabel,
                                    subjectLabel: config.subjectLabel,
                                    questionKey: config.questionKey
                                });
                                setSelectedScienceTopic(null);
                                onNavigate(config.listRoute);
                            }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = [config.classLabel, config.subjectLabel, topicKey].join('-');
                            const topicAction = () => {
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: config.classLabel,
                                    subjectLabel: config.subjectLabel,
                                    questionKey: config.questionKey
                                });
                                setSelectedScienceTopic(topic);
                                onNavigate(config.topicRoute);
                            };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({
                                type: 'Topic',
                                title: topic.name,
                                subtitle: config.subjectLabel + ' • ' + chapter.name,
                                keywords: [topic.name, chapter.name, config.subjectLabel, 'topic'].join(' '),
                                onSelect: topicAction
                            });
                            addContentEntries({
                                noteKey,
                                parentLabel,
                                onSelect: topicAction,
                                videoContext: {
                                    title: topic.name,
                                    subtitle: chapter.name,
                                    backRoute: config.topicRoute,
                                    backgroundClass: 'bg-[#ecfdf3]'
                                }
                            });
                        });
                    });
                });

                (sscIctChapters || []).forEach((chapter) => {
                    addEntry({
                        type: 'Chapter',
                        title: chapter.name,
                        subtitle: 'ICT • SSC',
                        keywords: [chapter.name, 'ICT', 'SSC', 'chapter'].join(' '),
                        onSelect: () => {
                            setSelectedIctChapter(chapter);
                            setSelectedIctClass('SSC');
                            onNavigate('public-ssc-ict-mcq');
                        }
                    });
                });

                religionOptions.forEach((option) => {
                    const chapters = (sscReligionChapters || {})[option.key] || [];
                    chapters.forEach((chapter) => {
                        addEntry({
                            type: 'Chapter',
                            title: chapter.name,
                            subtitle: option.label + ' • Religion',
                            keywords: [chapter.name, option.label, option.subtitle, 'religion', 'chapter'].join(' '),
                            onSelect: () => {
                                setSelectedReligion(option);
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: 'SSC',
                                    subjectLabel: 'Religion and Moral Education',
                                    religionKey: option.key
                                });
                                setSelectedScienceTopic(null);
                                onNavigate('public-ssc-religion-topics');
                            }
                        });
                        (chapter.topics || []).forEach((topic) => {
                            const topicKey = getScienceTopicKey(chapter.id, topic.id);
                            const noteKey = ['SSC', getReligionSubjectKey(option), topicKey].join('-');
                            const topicAction = () => {
                                setSelectedReligion(option);
                                setSelectedScienceChapter(chapter);
                                setSelectedScienceSubject({
                                    classLabel: 'SSC',
                                    subjectLabel: 'Religion and Moral Education',
                                    religionKey: option.key
                                });
                                setSelectedScienceTopic(topic);
                                onNavigate('public-ssc-religion-topic');
                            };
                            const parentLabel = topic.name + ' • ' + chapter.name;
                            addEntry({
                                type: 'Topic',
                                title: topic.name,
                                subtitle: option.label + ' • ' + chapter.name,
                                keywords: [topic.name, chapter.name, option.label, 'religion', 'topic'].join(' '),
                                onSelect: topicAction
                            });
                            addContentEntries({
                                noteKey,
                                parentLabel,
                                onSelect: topicAction,
                                videoContext: {
                                    title: topic.name,
                                    subtitle: chapter.name,
                                    backRoute: 'public-ssc-religion-topic',
                                    backgroundClass: 'bg-[#ecfdf3]'
                                }
                            });
                        });
                    });
                });






















                
            const quickResults = normalizedQuickQuery
                ? buildQuickSearchEntries().filter((entry) => {
                    const haystack = (entry.keywords || entry.title || '').toLowerCase();
                    return haystack.includes(normalizedQuickQuery);
                }).slice(0, 10)
                : [];

            const handleQuickSelect = (entry) => {
                if (!entry?.onSelect) return;
                entry.onSelect();
            };

            return (
                <div className="flex-1 bg-[#f3f6ff]">
                    <section className="relative overflow-hidden bg-indigo-700">
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/60"></div>
                        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-400/40"></div>
                        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-md bg-white/90 border border-white/60 flex items-center justify-center shadow-lg">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                                            <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                                            <path d="M20.5 9.7V14" />
                                            <path d="M21.5 14h-2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl sm:text-4xl font-semibold text-white">Freeducation</div>
                                        <div className="text-sm text-white/80 uppercase tracking-[0.2em] mt-1">
                                            Serve education with clarity
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-xl bg-indigo-600 border border-indigo-500 rounded-md p-6 text-white">
                                    <p className="text-base sm:text-lg font-serif italic leading-relaxed">
                                        “{activeQuote.text}”
                                    </p>
                                    <p className="text-sm font-semibold text-white/90 mt-3">— {activeQuote.author}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="relative">
                                    <label className="text-[11px] uppercase tracking-[0.3em] text-white/70">Quick Search</label>
                                    <input
                                        value={quickQuery}
                                        onChange={(event) => setQuickQuery(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' && quickResults[0]) {
                                                handleQuickSelect(quickResults[0]);
                                            }
                                        }}
                                        placeholder="Search subjects, chapters, topics, notes, videos..."
                                        className="mt-2 w-full rounded-lg border border-white/30 bg-white/95 py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
                                    {normalizedQuickQuery && (
                                        <div className="absolute left-0 right-0 mt-2 z-[40] rounded-lg border border-white/40 bg-white/95 text-slate-700 max-h-72 overflow-y-auto">
                                            {quickResults.length === 0 && (
                                                <div className="px-4 py-3 text-sm text-slate-400 text-left">
                                                    No matches found.
                                                </div>
                                            )}
                                            {quickResults.map((entry, index) => (
                                                <button
                                                    key={entry.title + '-' + entry.type + '-' + index}
                                                    onClick={() => handleQuickSelect(entry)}
                                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition"
                                                >
                                                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{entry.type}</div>
                                                    <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                                                    {entry.subtitle && (
                                                        <div className="text-xs text-slate-500 mt-1">{entry.subtitle}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {continueLabel && continueRoute && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => onNavigate(continueRoute)}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-emerald-400/90 text-emerald-950 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-emerald-300 transition"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        Continue Reading: {continueLabel}
                                    </button>
                                </div>
                            )}
                            {continueVideoTitle && (
                                <div className="mt-3">
                                    <button
                                        onClick={() => onNavigate(continueVideoRoute)}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 rounded-md bg-indigo-500/90 text-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-indigo-400 transition"
                                    >
                                        <i className="fa-solid fa-circle-play"></i>
                                        Continue Watching: {continueVideoTitle}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-6 bg-white">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-[0.2em] text-indigo-500">Academic</div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">Academic</h2>
                        </div>
                        <SubjectRow
                            title="SSC"
                            subjects={sscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('ssc-subjects')}
                            thumbnailMap={thumbnailMap}
                            readMap={readMap}
                        />
                        <SubjectRow
                            title="HSC"
                            subjects={hscFeaturedSubjects}
                            onNavigate={onNavigate}
                            onAll={() => onNavigate('hsc-subjects')}
                            thumbnailMap={thumbnailMap}
                            readMap={readMap}
                        />
                    </section>
                </div>
            );
        };
        return {
            StudentLanding,
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
        const {
            StudentLanding,
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
        } = LandingModule;
`;
