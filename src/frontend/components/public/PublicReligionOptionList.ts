export const PublicReligionOptionList =`
        const PublicReligionOptionList = ({ options, onSelect }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {options.map((option) => (
                    <button
                        key={option.key}
                        onClick={() => onSelect(option)}
                        className="text-left transition-all duration-300 group"
                    >
                        <div className="space-y-2 h-full">
                            <div className={cardSurfaceClass + ' flex items-center justify-center'}>
                                <div className="text-center px-3 card-art-media">
                                    <div className="text-lg font-semibold text-slate-900">{option.label}</div>
                                    <div className="text-xs text-slate-500 mt-2 font-bangla">{option.subtitle}</div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );


`;
