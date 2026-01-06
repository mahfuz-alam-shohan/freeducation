export const PublicScienceTopicList =`
 const PublicScienceTopicList = ({ topics, onSelectTopic }) => (
            <div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic)}
                        className="w-full border border-slate-200 rounded-md p-4 text-center hover:border-slate-300 hover:bg-slate-50 transition font-bangla"
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">টপিক</div>
                        <div className="text-lg font-semibold text-slate-900 mt-2">{topic.name}</div>
                        <p className="text-sm text-slate-500 mt-2">নোট, CQ এবং MCQ দেখুন</p>
                    </button>
                ))}
                {topics.length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-md p-6 text-sm text-slate-400 font-bangla text-center">
                        এখনো কোনো টপিক যোগ করা হয়নি।
                    </div>
                )}
            </div>
        );

`;
