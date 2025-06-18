// Search functionality for EduSphere
document.addEventListener('DOMContentLoaded', function() {
    initSearchFunctionality();
});

function initSearchFunctionality() {
    // Initialize search for subjects page
    const subjectSearchInput = document.getElementById('search-input');
    if (subjectSearchInput) {
        initSubjectSearch(subjectSearchInput);
    }
    
    // Initialize search for grammar page
    const grammarSearchInput = document.getElementById('grammar-search-input');
    if (grammarSearchInput) {
        initGrammarSearch(grammarSearchInput);
    }
}

// Subject search functionality
function initSubjectSearch(searchInput) {
    const subjectSections = document.querySelectorAll('.subject-section');
    const subjectCards = document.querySelectorAll('.subject-card');
    
    // Create searchable content index
    const searchableContent = [];
    
    subjectSections.forEach((section, index) => {
        const title = section.querySelector('h2')?.textContent || '';
        const content = section.textContent.toLowerCase();
        const id = section.id || `section-${index}`;
        
        searchableContent.push({
            element: section,
            title: title,
            content: content,
            id: id,
            type: 'section'
        });
    });
    
    subjectCards.forEach((card, index) => {
        const title = card.querySelector('h3')?.textContent || '';
        const content = card.textContent.toLowerCase();
        const href = card.getAttribute('href') || '';
        
        searchableContent.push({
            element: card,
            title: title,
            content: content,
            href: href,
            type: 'card'
        });
    });
    
    // Debounced search function
    const debouncedSearch = debounce(function(query) {
        performSubjectSearch(query, searchableContent);
    }, 300);
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        debouncedSearch(query);
    });
    
    // Clear search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            clearSubjectSearch(searchableContent);
        }
    });
}

function performSubjectSearch(query, searchableContent) {
    if (!query) {
        clearSubjectSearch(searchableContent);
        return;
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results = [];
    
    searchableContent.forEach(item => {
        const score = calculateSearchScore(item, searchTerms);
        if (score > 0) {
            results.push({ ...item, score });
        }
    });
    
    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    
    // Hide all items first
    searchableContent.forEach(item => {
        item.element.style.display = 'none';
        item.element.classList.remove('search-highlight');
    });
    
    // Show matching results
    if (results.length > 0) {
        results.forEach(result => {
            result.element.style.display = 'block';
            result.element.classList.add('search-highlight');
            highlightSearchTerms(result.element, searchTerms);
        });
        
        showSearchResults(results.length, query);
    } else {
        showNoResults(query);
    }
}

function clearSubjectSearch(searchableContent) {
    searchableContent.forEach(item => {
        item.element.style.display = 'block';
        item.element.classList.remove('search-highlight');
        removeHighlights(item.element);
    });
    
    hideSearchMessage();
}

// Grammar search functionality
function initGrammarSearch(searchInput) {
    const grammarSections = document.querySelectorAll('.grammar-section');
    const grammarCards = document.querySelectorAll('.grammar-card');
    
    // Create searchable content index
    const searchableContent = [];
    
    grammarSections.forEach((section, index) => {
        const title = section.querySelector('h2')?.textContent || '';
        const content = section.textContent.toLowerCase();
        const id = section.id || `grammar-section-${index}`;
        
        searchableContent.push({
            element: section,
            title: title,
            content: content,
            id: id,
            type: 'section'
        });
    });
    
    grammarCards.forEach((card, index) => {
        const title = card.querySelector('h3')?.textContent || '';
        const content = card.textContent.toLowerCase();
        const href = card.getAttribute('href') || '';
        
        searchableContent.push({
            element: card,
            title: title,
            content: content,
            href: href,
            type: 'card'
        });
    });
    
    // Debounced search function
    const debouncedSearch = debounce(function(query) {
        performGrammarSearch(query, searchableContent);
    }, 300);
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        debouncedSearch(query);
    });
    
    // Clear search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            clearGrammarSearch(searchableContent);
        }
    });
}

function performGrammarSearch(query, searchableContent) {
    if (!query) {
        clearGrammarSearch(searchableContent);
        return;
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results = [];
    
    searchableContent.forEach(item => {
        const score = calculateSearchScore(item, searchTerms);
        if (score > 0) {
            results.push({ ...item, score });
        }
    });
    
    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    
    // Hide all items first
    searchableContent.forEach(item => {
        item.element.style.display = 'none';
        item.element.classList.remove('search-highlight');
    });
    
    // Show matching results
    if (results.length > 0) {
        results.forEach(result => {
            result.element.style.display = 'block';
            result.element.classList.add('search-highlight');
            highlightSearchTerms(result.element, searchTerms);
        });
        
        showSearchResults(results.length, query);
    } else {
        showNoResults(query);
    }
}

function clearGrammarSearch(searchableContent) {
    searchableContent.forEach(item => {
        item.element.style.display = 'block';
        item.element.classList.remove('search-highlight');
        removeHighlights(item.element);
    });
    
    hideSearchMessage();
}

// Search scoring algorithm
function calculateSearchScore(item, searchTerms) {
    let score = 0;
    const title = item.title.toLowerCase();
    const content = item.content;
    
    searchTerms.forEach(term => {
        // Exact title match gets highest score
        if (title.includes(term)) {
            score += title === term ? 100 : 50;
        }
        
        // Content matches
        if (content.includes(term)) {
            score += 10;
            
            // Bonus for multiple occurrences
            const occurrences = (content.match(new RegExp(term, 'g')) || []).length;
            score += (occurrences - 1) * 2;
        }
        
        // Partial matches
        if (term.length > 3) {
            const fuzzyMatches = findFuzzyMatches(term, content);
            score += fuzzyMatches * 2;
        }
    });
    
    return score;
}

// Find fuzzy matches for better search results
function findFuzzyMatches(term, content) {
    let matches = 0;
    const words = content.split(' ');
    
    words.forEach(word => {
        if (word.length > 3 && (
            word.startsWith(term.substring(0, 3)) ||
            term.startsWith(word.substring(0, 3)) ||
            levenshteinDistance(term, word) <= 2
        )) {
            matches++;
        }
    });
    
    return matches;
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Highlight search terms in content
function highlightSearchTerms(element, searchTerms) {
    const textNodes = getTextNodes(element);
    
    textNodes.forEach(node => {
        let text = node.textContent;
        let hasMatches = false;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
            if (regex.test(text)) {
                hasMatches = true;
                text = text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            }
        });
        
        if (hasMatches) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = text;
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

// Remove highlights from search results
function removeHighlights(element) {
    const marks = element.querySelectorAll('mark');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
    
    // Remove wrapper spans
    const wrappers = element.querySelectorAll('span');
    wrappers.forEach(wrapper => {
        if (wrapper.innerHTML === wrapper.textContent) {
            const parent = wrapper.parentNode;
            parent.replaceChild(document.createTextNode(wrapper.textContent), wrapper);
            parent.normalize();
        }
    });
}

// Get all text nodes in an element
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
            textNodes.push(node);
        }
    }
    
    return textNodes;
}

// Escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Show search results message
function showSearchResults(count, query) {
    hideSearchMessage();
    
    const message = document.createElement('div');
    message.id = 'search-message';
    message.className = 'bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-search mr-2"></i>
            <span>Found ${count} result${count !== 1 ? 's' : ''} for "${query}"</span>
            <button class="ml-auto text-blue-600 hover:text-blue-800" onclick="clearAllSearches()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    const container = document.querySelector('.max-w-7xl');
    if (container) {
        container.insertBefore(message, container.firstElementChild);
    }
}

// Show no results message
function showNoResults(query) {
    hideSearchMessage();
    
    const message = document.createElement('div');
    message.id = 'search-message';
    message.className = 'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>No results found for "${query}". Try different keywords.</span>
            <button class="ml-auto text-yellow-600 hover:text-yellow-800" onclick="clearAllSearches()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    const container = document.querySelector('.max-w-7xl');
    if (container) {
        container.insertBefore(message, container.firstElementChild);
    }
}

// Hide search message
function hideSearchMessage() {
    const existingMessage = document.getElementById('search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Clear all searches (global function)
function clearAllSearches() {
    const searchInputs = document.querySelectorAll('#search-input, #grammar-search-input');
    searchInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
    });
    
    hideSearchMessage();
}

// Advanced search suggestions
function initSearchSuggestions() {
    const searchInputs = document.querySelectorAll('#search-input, #grammar-search-input');
    
    searchInputs.forEach(input => {
        const suggestions = createSuggestionBox(input);
        
        input.addEventListener('focus', function() {
            showPopularSearches(suggestions);
        });
        
        input.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 1) {
                showSearchSuggestions(suggestions, query);
            } else {
                showPopularSearches(suggestions);
            }
        });
        
        input.addEventListener('blur', function() {
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200);
        });
    });
}

function createSuggestionBox(input) {
    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions absolute top-full left-0 right-0 bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto';
    suggestions.style.display = 'none';
    suggestions.style.backgroundColor = '#f3f4f6';
    suggestions.style.color = '#000';
    suggestions.style.border = '1px solid #ccc';
    
    input.parentNode.classList.add('relative');
    input.parentNode.appendChild(suggestions);
    
    return suggestions;
}

function showPopularSearches(suggestionsBox) {
    const popularSearches = [
        'mathematics', 'algebra', 'geometry', 'calculus',
        'physics', 'mechanics', 'electricity', 'waves',
        'chemistry', 'biology', 'science',
        'english grammar', 'tenses', 'passive voice', 'articles',
        'history', 'computer programming', 'algorithms'
    ];
    
    const html = `
        <div class="p-2">
            <div class="text-sm text-gray-700 font-semibold mb-2">Popular searches:</div>
            ${popularSearches.slice(0, 8).map(term => 
                `<div class="suggestion-item px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-900" data-term="${term}">
                    <i class="fas fa-search text-gray-500 mr-2"></i>${term}
                </div>`
            ).join('')}
        </div>
    `;
    
    suggestionsBox.innerHTML = html;
    suggestionsBox.style.display = 'block';
    
    // Add click listeners
    suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const input = suggestionsBox.previousElementSibling;
            input.value = this.dataset.term;
            input.dispatchEvent(new Event('input'));
            suggestionsBox.style.display = 'none';
        });
    });
}

function showSearchSuggestions(suggestionsBox, query) {
    // This would typically connect to a search API
    // For now, we'll provide basic suggestions based on available content
    const suggestions = generateSuggestions(query);
    
    if (suggestions.length > 0) {
        const html = `
            <div class="p-2">
                ${suggestions.map(suggestion => 
                    `<div class="suggestion-item px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-900" data-term="${suggestion}">
                        <i class="fas fa-search text-gray-500 mr-2"></i>${suggestion}
                    </div>`
                ).join('')}
            </div>
        `;
        
        suggestionsBox.innerHTML = html;
        suggestionsBox.style.display = 'block';
        
        // Add click listeners
        suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const input = suggestionsBox.previousElementSibling;
                input.value = this.dataset.term;
                input.dispatchEvent(new Event('input'));
                suggestionsBox.style.display = 'none';
            });
        });
    } else {
        suggestionsBox.style.display = 'none';
    }
}

function generateSuggestions(query) {
    const allTerms = [
        // Math terms
        'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics', 'probability',
        'equations', 'functions', 'derivatives', 'integrals', 'polynomials',
        
        // Science terms  
        'biology', 'chemistry', 'physics', 'atoms', 'molecules', 'cells',
        'ecosystem', 'evolution', 'genetics', 'periodic table', 'chemical reactions',
        
        // Physics terms
        'mechanics', 'thermodynamics', 'electricity', 'magnetism', 'waves', 'optics',
        'quantum mechanics', 'relativity', 'forces', 'energy', 'momentum',
        
        // Grammar terms
        'tenses', 'passive voice', 'active voice', 'direct speech', 'indirect speech',
        'articles', 'pronouns', 'adjectives', 'adverbs', 'conjunctions', 'prepositions',
        'modals', 'conditionals', 'reported speech',
        
        // History terms
        'ancient civilizations', 'medieval period', 'modern history', 'world wars',
        'independence', 'revolution', 'empire', 'democracy',
        
        // Computer terms
        'programming', 'algorithms', 'data structures', 'software', 'hardware',
        'artificial intelligence', 'machine learning', 'databases', 'networks'
    ];
    
    const queryLower = query.toLowerCase();
    
    return allTerms
        .filter(term => term.toLowerCase().includes(queryLower))
        .slice(0, 6);
}

// Initialize search suggestions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSearchSuggestions, 1000); // Delay to ensure other elements are loaded
});

// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export search functions for external use
window.EduSphereSearch = {
    initSearchFunctionality,
    initSubjectSearch,
    initGrammarSearch,
    clearAllSearches,
    initSearchSuggestions
};
