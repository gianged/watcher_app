package com.watcher.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private boolean success;
    private List<T> data;
    private PaginationInfo pagination;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationInfo {
        private int page;
        private int limit;
        private long total;
        private int totalPages;
    }

    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
                .success(true)
                .data(page.getContent())
                .pagination(PaginationInfo.builder()
                        .page(page.getNumber())
                        .limit(page.getSize())
                        .total(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .build())
                .build();
    }
}
