from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'size'
    page_query_param = 'page'

    def get_paginated_response(self, data):
        self.page_size = self.get_page_size(self.request)
        return Response(
            {
                'size': self.page_size,
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current': self.page.number,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'results': data,
            }
        )
