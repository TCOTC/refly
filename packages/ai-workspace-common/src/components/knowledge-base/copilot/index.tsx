import { Button, Checkbox } from '@arco-design/web-react';

// 自定义组件
import {
  IconCaretDown,
  IconEdit,
  IconFile,
  IconFolder,
  IconHistory,
  IconMessage,
  IconPlusCircle,
  IconSettings,
  IconTranslate,
} from '@arco-design/web-react/icon';
// 自定义样式
import './index.scss';
// 自定义组件
import { SearchTargetSelector } from '@refly-packages/ai-workspace-common/components/search-target-selector';
import { useSearchParams } from '@refly-packages/ai-workspace-common/utils/router';
import { SearchTarget, useSearchStateStore } from '@refly-packages/ai-workspace-common/stores/search-state';
import { ContextStateDisplay } from './context-state-display/index';
import { useCopilotContextState } from '@refly-packages/ai-workspace-common/hooks/use-copilot-context-state';
import { useEffect, useState } from 'react';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { ConvListModal } from './conv-list-modal';
import { KnowledgeBaseListModal } from './knowledge-base-list-modal';

// requests
import getClient from '@refly-packages/ai-workspace-common/requests/proxiedRequest';

// state
import { useChatStore } from '@refly-packages/ai-workspace-common/stores/chat';
import { useConversationStore } from '@refly-packages/ai-workspace-common/stores/conversation';
import { useResetState } from '@refly-packages/ai-workspace-common/hooks/use-reset-state';
import { useBuildThreadAndRun } from '@refly-packages/ai-workspace-common/hooks/use-build-thread-and-run';
import { delay } from '@refly-packages/ai-workspace-common/utils/delay';
import { ActionSource, useKnowledgeBaseStore } from '@refly-packages/ai-workspace-common/stores/knowledge-base';
// utils
import { LOCALE } from '@refly/constants';
import { localeToLanguageName } from '@refly-packages/ai-workspace-common/utils/i18n';
import { OutputLocaleList } from '@refly-packages/ai-workspace-common/components/output-locale-list';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@refly-packages/ai-workspace-common/stores/user';
import { SourceListModal } from '@refly-packages/ai-workspace-common/components/source-list/source-list-modal';
import { useResizeCopilot } from '@refly-packages/ai-workspace-common/hooks/use-resize-copilot';
import { useMessageStateStore } from '@refly-packages/ai-workspace-common/stores/message-state';
import { RegisterSkillComponent } from '@refly-packages/ai-workspace-common/skills/main-logic/register-skill-component';
import { KnowledgeBaseNavHeader } from '@refly-packages/ai-workspace-common/components/knowledge-base/nav-header';
import classNames from 'classnames';
import { useAINote } from '@refly-packages/ai-workspace-common/hooks/use-ai-note';
import { useSkillManagement } from '@refly-packages/ai-workspace-common/hooks/use-skill-management';
import { useSkillStore } from '@refly-packages/ai-workspace-common/stores/skill';

interface AICopilotProps {}

export const AICopilot = (props: AICopilotProps) => {
  const [searchParams] = useSearchParams();
  const [copilotBodyHeight, setCopilotBodyHeight] = useState(215 - 32);
  const userStore = useUserStore();
  const knowledgeBaseStore = useKnowledgeBaseStore();
  const { contextCardHeight, showContextCard, showContextState, showSelectedTextContext } = useCopilotContextState();
  const chatStore = useChatStore();
  const conversationStore = useConversationStore();
  const [isFetching, setIsFetching] = useState(false);
  const { runSkill } = useBuildThreadAndRun();
  const searchStateStore = useSearchStateStore();
  const messageStateStore = useMessageStateStore();
  const skillStore = useSkillStore();

  const convId = searchParams.get('convId');
  const { resetState } = useResetState();
  const actualCopilotBodyHeight =
    copilotBodyHeight + (showContextCard ? contextCardHeight : 0) + 32 + (skillStore?.selectedSkill ? 32 : 0) - 16;

  const { t, i18n } = useTranslation();
  const uiLocale = i18n?.languages?.[0] as LOCALE;
  const outputLocale = userStore?.localSettings?.outputLocale || 'en';
  console.log('uiLocale', uiLocale);

  // ai-note handler
  useAINote();
  useSkillManagement({ shouldInit: true });

  const handleSwitchSearchTarget = () => {
    if (showContextState) {
      searchStateStore.setSearchTarget(SearchTarget.CurrentPage);
    }
  };

  const handleNewTempConv = () => {
    conversationStore.resetState();
    chatStore.resetState();
    messageStateStore.resetState();
  };

  const handleNewOpenConvList = () => {
    knowledgeBaseStore.updateConvModalVisible(true);
  };

  const handleGetThreadMessages = async (convId: string) => {
    // 异步操作
    const { data: res, error } = await getClient().getConversationDetail({
      path: {
        convId,
      },
    });

    console.log('getThreadMessages', res, error);

    if (error) {
      throw error;
    }

    // 清空之前的状态
    resetState();

    // 设置会话和消息
    if (res?.data) {
      conversationStore.setCurrentConversation(res?.data);
    }

    chatStore.setMessages(res.data.messages);
  };

  const handleConvTask = async (convId: string) => {
    try {
      setIsFetching(true);
      const { isNewConversation, newQAText } = useChatStore.getState();

      // 新会话，需要手动构建第一条消息
      if (isNewConversation && convId && newQAText) {
        // 更换成基于 task 的消息模式，核心是基于 task 来处理
        runSkill(newQAText);
      } else if (convId) {
        handleGetThreadMessages(convId);
      }
    } catch (err) {
      console.log('thread error');
    }

    await delay(1500);
    setIsFetching(false);

    // reset state
    chatStore.setIsNewConversation(false);
  };

  useEffect(() => {
    if (convId) {
      handleConvTask(convId);
    }

    return () => {
      chatStore.setMessages([]);
    };
  }, [convId]);
  useEffect(() => {
    handleSwitchSearchTarget();
  }, [showContextState]);
  useResizeCopilot({ containerSelector: 'ai-copilot-container' });

  return (
    <div className="ai-copilot-container">
      <div className="knowledge-base-detail-header">
        <div className="knowledge-base-detail-navigation-bar">
          <Checkbox key={'knowledge-base-resource-panel'} checked={knowledgeBaseStore.resourcePanelVisible}>
            {({ checked }) => {
              return (
                <Button
                  icon={<IconFile />}
                  type="text"
                  onClick={() => {
                    knowledgeBaseStore.updateResourcePanelVisible(!knowledgeBaseStore.resourcePanelVisible);
                  }}
                  className={classNames('assist-action-item', { active: checked })}
                ></Button>
              );
            }}
          </Checkbox>
          <Checkbox key={'knowledge-base-note-panel'} checked={knowledgeBaseStore.notePanelVisible}>
            {({ checked }) => {
              return (
                <Button
                  icon={<IconEdit />}
                  type="text"
                  onClick={() => {
                    knowledgeBaseStore.updateNotePanelVisible(!knowledgeBaseStore.notePanelVisible);
                  }}
                  className={classNames('assist-action-item', { active: checked })}
                ></Button>
              );
            }}
          </Checkbox>
        </div>
        <div className="knowledge-base-detail-menu">
          {/* <Button
            type="text"
            icon={<IconMore style={{ fontSize: 16 }} />}></Button> */}
        </div>
      </div>
      <div
        className="ai-copilot-message-container"
        style={{ height: `calc(100vh - ${actualCopilotBodyHeight}px - 50px)` }}
      >
        <ChatMessages />
      </div>
      <div className="ai-copilot-body" style={{ height: actualCopilotBodyHeight }}>
        {showContextCard ? (
          <div className="ai-copilot-context-display">
            <ContextStateDisplay />
          </div>
        ) : null}
        <div className="ai-copilot-chat-container">
          <div className="chat-setting-container">
            <div className="chat-operation-container">
              <Button
                icon={<IconFolder />}
                type="text"
                onClick={() => {
                  knowledgeBaseStore.updateActionSource(ActionSource.Conv);
                  knowledgeBaseStore.updateKbModalVisible(true);
                }}
                className="chat-input-assist-action-item"
              >
                选择知识库
                <IconCaretDown />
              </Button>
            </div>
            <div className="conv-operation-container">
              <Button
                icon={<IconHistory />}
                type="text"
                onClick={() => {
                  handleNewOpenConvList();
                }}
                className="chat-input-assist-action-item"
              >
                会话历史
              </Button>
              <Button
                icon={<IconPlusCircle />}
                type="text"
                onClick={() => {
                  handleNewTempConv();
                }}
                className="chat-input-assist-action-item"
              >
                新会话
              </Button>
            </div>
          </div>

          <div className="skill-container">
            {skillStore?.skillInstances?.map((item, index) => (
              <div
                key={index}
                className="skill-item"
                onClick={() => {
                  skillStore.setSelectedSkillInstalce(item);
                }}
              >
                {item?.skillDisplayName}
              </div>
            ))}
            <div key="more" className="skill-item">
              <IconSettings /> <p className="skill-title">技能管理</p>
            </div>
          </div>
          <div className="chat-input-container" style={{ height: skillStore?.selectedSkill ? 117 + 32 : 117 }}>
            <div className="chat-input-body">
              <ChatInput placeholder="提出问题，发现新知" autoSize={{ minRows: 3, maxRows: 3 }} />
            </div>
            <div className="chat-input-assist-action">
              {!showSelectedTextContext ? <SearchTargetSelector classNames="chat-input-assist-action-item" /> : null}

              <OutputLocaleList>
                <Button icon={<IconTranslate />} type="text" className="chat-input-assist-action-item">
                  <span>{localeToLanguageName?.[uiLocale]?.[outputLocale]} </span>
                  <IconCaretDown />
                </Button>
              </OutputLocaleList>
            </div>
          </div>
        </div>
      </div>
      {knowledgeBaseStore?.convModalVisible ? <ConvListModal title="会话库" classNames="conv-list-modal" /> : null}
      {knowledgeBaseStore?.kbModalVisible && knowledgeBaseStore.actionSource === ActionSource.Conv ? (
        <KnowledgeBaseListModal title="知识库" classNames="kb-list-modal" />
      ) : null}
      {knowledgeBaseStore?.sourceListModalVisible ? (
        <SourceListModal
          title={`结果来源 (${knowledgeBaseStore?.tempConvResources?.length || 0})`}
          classNames="source-list-modal"
          resources={knowledgeBaseStore?.tempConvResources || []}
        />
      ) : null}

      {/** 注册 Skill 相关内容，目前先收敛在 Copilot 内部，后续允许挂在在其他扩展点，比如笔记、reading */}
      <RegisterSkillComponent />
    </div>
  );
};
