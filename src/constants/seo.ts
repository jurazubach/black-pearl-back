export const BEGIN_DELIMITER_REGEX = /^(\|)/gim;
export const END_DELIMITER_REGEX = /(\|)$/gim;
export const DOUBLE_DELIMITER_REGEX = /(\|\|)/gim;
export const SPACING_REGEX = /\s\s+/gim;
export const PLACEHOLDER_REGEX = /({\w+})/gim;

export const MAX_MULTIPLE_FILTER_INDEXING = 2;
export const MAX_FILTER_INDEXING = 2;

export const ROBOT_TYPES = {
    INDEX_FOLLOW: "index, follow",
    NOINDEX_FOLLOW: "noindex, follow",
    NOINDEX_NOFOLLOW: "noindex, nofollow",
};
