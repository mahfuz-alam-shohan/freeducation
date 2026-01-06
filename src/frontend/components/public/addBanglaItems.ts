export const addBanglaItems =`
const addBanglaItems = (classLabel, categoryLabel, items, itemRoute) => {
                    (items || []).forEach((item) => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const label = typeof item === 'string' ? categoryLabel : item.type;
                        if (!itemName || !label) return;
                        const noteKey = [classLabel, label, itemName].join('-');
                        const itemAction = () => {
                            storeBanglaSelection({
                                classLabel,
                                categoryName: label,
                                itemName
                            });
                            setSelectedBanglaItem(itemName);
                            setSelectedBanglaCategory(label);
                            onNavigate(itemRoute);
                        };
                        const parentLabel = itemName + ' • ' + label;
                        addEntry({
                            type: 'Content',
                            title: itemName,
                            subtitle: classLabel + ' Bangla • ' + label,
                            keywords: [itemName, label, classLabel, 'bangla', 'content'].join(' '),
                            onSelect: itemAction
                        });
                        addContentEntries({
                            noteKey,
                            parentLabel,
                            onSelect: itemAction,
                            videoContext: {
                                title: itemName,
                                subtitle: label,
                                backRoute: itemRoute,
                                backgroundClass: 'bg-[#fff7ed]'
                            }
                        });
                    });
                };

                addBanglaItems('SSC', 'গদ্য', sscGoddoItems, 'public-bangla-ssc-item');
                addBanglaItems('SSC', 'পদ্য', sscPoddoItems, 'public-bangla-ssc-item');
                addBanglaItems('SSC', 'সহপাঠ', sscShohopathItems, 'public-bangla-ssc-item');
                addBanglaItems('HSC', 'গদ্য', hscGoddoItems, 'public-bangla-hsc-item');
                addBanglaItems('HSC', 'পদ্য', hscPoddoItems, 'public-bangla-hsc-item');
                addBanglaItems('HSC', 'সহপাঠ', hscShohopathItems, 'public-bangla-hsc-item');

                return entries;
            };


`;
