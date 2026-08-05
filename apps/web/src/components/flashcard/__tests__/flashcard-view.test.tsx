import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlashcardDeckPlayer, FlashcardItem } from '../flashcard-deck-player';
import { FlashcardFilterBar } from '../flashcard-filter-bar';

const mockCards: FlashcardItem[] = [
  {
    id: 'card-1',
    frontText: '安全',
    backText: 'An toàn lao động',
    pinyinOrIpa: 'ān quán',
    topic: 'Safety & Protection',
    factoryDomain: 'an_toan',
    language: 'zh',
    hskLevel: 'HSK1',
    partOfSpeech: 'noun',
    mnemonic: 'Bộ Kim + An',
  },
];

describe('Flashcard Deck Player Component', () => {
  it('renders front text and level badge correctly', () => {
    const handleRate = vi.fn();
    render(
      <FlashcardDeckPlayer
        cards={mockCards}
        lang="zh"
        onRateCard={handleRate}
      />
    );

    expect(screen.getByText('安全')).toBeInTheDocument();
    expect(screen.getByText('ān quán')).toBeInTheDocument();
    expect(screen.getByText('HSK1')).toBeInTheDocument();
  });

  it('renders 4 SRS rating buttons', () => {
    const handleRate = vi.fn();
    render(
      <FlashcardDeckPlayer
        cards={mockCards}
        lang="zh"
        onRateCard={handleRate}
      />
    );

    expect(screen.getAllByText(/Quên/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Khó/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nhớ tốt/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rất dễ/).length).toBeGreaterThan(0);
  });
});

describe('Flashcard Filter Bar Component', () => {
  it('renders level and topic select dropdowns', () => {
    const mockFilters = {
      lang: 'zh' as const,
      level: '',
      topic: '',
      pos: '',
      status: 'all',
      specialMode: '',
    };
    const handleFilterChange = vi.fn();

    render(
      <FlashcardFilterBar
        filters={mockFilters}
        onFilterChange={handleFilterChange}
        totalCardsCount={3000}
        dueCount={45}
      />
    );

    expect(screen.getByText(/Cấp độ/)).toBeInTheDocument();
    expect(screen.getByText(/Chủ đề nhà máy/)).toBeInTheDocument();
    expect(screen.getByText(/Từ loại/)).toBeInTheDocument();
    expect(screen.getByText(/Trạng thái SRS/)).toBeInTheDocument();
  });
});
