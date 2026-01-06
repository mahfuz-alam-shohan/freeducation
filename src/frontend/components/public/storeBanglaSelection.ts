export const storeBanglaSelection  =`
        const storeBanglaSelection = ({ classLabel, categoryName, itemName }) => {
            try {
                localStorage.setItem(
                    'freeducation.bangla-selection',
                    JSON.stringify({
                        classLabel,
                        categoryName,
                        itemName
                    })
                );
            } catch (error) {
                console.warn('Failed to store Bangla selection', error);
            }
        };


`;
