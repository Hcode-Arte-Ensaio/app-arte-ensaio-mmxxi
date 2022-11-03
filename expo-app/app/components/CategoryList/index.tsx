import styled from '@emotion/native';
import { useState, useRef, useCallback, useEffect } from 'react';
import { StyleProp, ViewStyle, ScrollView, Dimensions } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useData } from '../../contexts/DataContext';
import { Category } from '../../types/Category';
import { CategoryItem, CategoryItemLayoutType } from '../CategoryItem';

const Wrap = styled.View``;

const ScrollViewStyled = styled.ScrollView`
  flex-direction: row;
`;

export type CategoryListProps = {
  style?: StyleProp<ViewStyle>;
  onSelect?: (category: Category) => void;
};

export const CategoryList = ({ style, onSelect }: CategoryListProps) => {
  const scrollRef = useRef(null);
  const { showToast } = useApp();
  const { getCategories } = useData();
  const [items, setItems] = useState<Category[]>([]);
  const [active, setActive] = useState(-1);
  const onCategoryPress = useCallback(
    (
      _e: any,
      index: number,
      layout: CategoryItemLayoutType,
      item: Category
    ) => {
      if (scrollRef.current) {
        const scroll = scrollRef.current as ScrollView;

        scroll.scrollTo({
          x: layout.x + layout.width / 2 - Dimensions.get('window').width / 2,
        });
      }

      setActive(index);
    },
    [scrollRef]
  );

  useEffect(() => {
    getCategories()
      .then(setItems)
      .catch((error) => {
        console.log(error, error.code);
        showToast('Não foi possível obter a lista de categorias.');
      });
  }, [getCategories]);

  useEffect(() => {
    if (typeof onSelect === 'function' && items[active]) {
      onSelect(items[active]);
    }
  }, [active, items]);

  useEffect(() => {
    if (items.length > 0) {
      setActive(0);
    }
  }, [items]);

  return (
    <Wrap>
      <ScrollViewStyled
        ref={scrollRef}
        style={style}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <CategoryItem
            title={item.name}
            key={index}
            active={index === active}
            onPress={(e, layout) => onCategoryPress(e, index, layout, item)}
          />
        ))}
      </ScrollViewStyled>
    </Wrap>
  );
};
