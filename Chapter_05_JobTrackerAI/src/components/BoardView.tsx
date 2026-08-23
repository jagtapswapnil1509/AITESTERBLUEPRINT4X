import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  rectIntersection,
  pointerWithin,
  CollisionDetection,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { JobApplication, ApplicationStatus } from '../types/job';
import { V2_KANBAN_COLUMNS } from '../utils/constants';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface BoardViewProps {
  applications: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onEditApp: (app: JobApplication) => void;
  onDeleteApp: (app: JobApplication) => void;
  onStatusChange: (appId: string, nextStatus: ApplicationStatus) => void;
  onQuickAddInStatus: (status: ApplicationStatus) => void;
}

/**
 * Custom collision detection for Kanban columns & cards.
 * 1. Checks if pointer is directly within a droppable column or card
 * 2. Checks bounding rectangle intersection
 * 3. Falls back to closest corners
 */
const customCollisionDetection: CollisionDetection = (args) => {
  // 1. Pointer inside droppable container or card
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // 2. Rect intersection between dragged overlay & droppables
  const rectCollisions = rectIntersection(args);
  if (rectCollisions.length > 0) {
    return rectCollisions;
  }

  // 3. Fallback to closest corners
  return closestCorners(args);
};

export const BoardView: React.FC<BoardViewProps> = ({
  applications,
  onSelectApp,
  onEditApp,
  onDeleteApp,
  onStatusChange,
  onQuickAddInStatus,
}) => {
  const [activeCard, setActiveCard] = useState<JobApplication | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  // Configure pointer & touch sensors with small distance constraint to distinguish click vs drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  // Group applications by 6 V2 columns
  const columnsData = V2_KANBAN_COLUMNS.map((status) => {
    const appsInCol = applications.filter((a) => a.status === status);
    return {
      status,
      apps: appsInCol,
    };
  });

  const getTargetStatusFromOver = (
    overId: string | number,
    overData?: any
  ): ApplicationStatus | null => {
    if (overData?.status) {
      return overData.status as ApplicationStatus;
    }
    if (overData?.app?.status) {
      return overData.app.status as ApplicationStatus;
    }
    const strId = String(overId);
    if (strId.startsWith('column-')) {
      return strId.replace('column-', '') as ApplicationStatus;
    }
    const found = applications.find((a) => a.id === strId);
    if (found) {
      return found.status;
    }
    if (V2_KANBAN_COLUMNS.includes(strId as ApplicationStatus)) {
      return strId as ApplicationStatus;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card =
      (active.data.current?.app as JobApplication) ||
      applications.find((a) => a.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }

    const targetCol = getTargetStatusFromOver(over.id, over.data?.current);
    setOverColumnId(targetCol);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentCard =
      activeCard ||
      (active.data.current?.app as JobApplication) ||
      applications.find((a) => a.id === active.id);

    setActiveCard(null);
    setOverColumnId(null);

    if (!over || !currentCard) return;

    const targetStatus = getTargetStatusFromOver(over.id, over.data?.current);

    if (targetStatus && targetStatus !== currentCard.status) {
      onStatusChange(currentCard.id, targetStatus);

      // Celebrate if moved to Offer stage!
      if (targetStatus === 'OFFER') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveCard(null);
    setOverColumnId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        id="kanban-board-container"
        className="flex gap-4 overflow-x-auto pb-6 pt-1 scrollbar-thin select-none items-start"
      >
        {columnsData.map(({ status, apps }) => (
          <KanbanColumn
            key={status}
            status={status}
            apps={apps}
            onSelectApp={onSelectApp}
            onEditApp={onEditApp}
            onDeleteApp={onDeleteApp}
            onStatusChange={onStatusChange}
            onQuickAdd={onQuickAddInStatus}
            isOver={overColumnId === status}
          />
        ))}
      </div>

      {/* Drag Overlay for smooth card movement representation */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.4',
              },
            },
          }),
        }}
      >
        {activeCard ? (
          <div className="rotate-2 scale-105 pointer-events-none shadow-2xl w-76 sm:w-80 cursor-grabbing">
            <KanbanCard
              app={activeCard}
              onSelect={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onStatusChange={() => {}}
              isOverlay={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
