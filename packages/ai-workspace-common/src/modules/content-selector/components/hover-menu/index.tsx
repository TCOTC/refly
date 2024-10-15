import React from 'react';
import { Button } from '@arco-design/web-react';
import { IconDelete } from '@arco-design/web-react/icon';
import { AiOutlineHighlight } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

interface HoverMenuProps {
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  selected: boolean;
}

const HoverMenu: React.FC<HoverMenuProps> = ({ onClick, onMouseEnter, onMouseLeave, selected }) => {
  const { t } = useTranslation();

  return (
    <div
      className="refly-selector-hover-menu"
      style={{
        position: 'absolute',
        zIndex: 10000,
        right: '0',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        padding: '2px 4px',
      }}
    >
      <Button type="text" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} size="mini">
        {t('knowledgeBase.context.addToContext')}
      </Button>
    </div>
  );
};

export default HoverMenu;
