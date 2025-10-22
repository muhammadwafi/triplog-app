from rest_framework.views import exception_handler


def custom_exception(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    # exc.detail = exc.get_full_details()
    response = exception_handler(exc, context)

    if response is not None:
        customized_response = {}
        customized_response['status_code'] = response.status_code
        customized_response['errors'] = []

        if isinstance(response.data, list):
            for message in response.data:
                customized_response['errors'].append(
                    {
                        'field': 'non_field_errors',
                        'message': message,
                    }
                )
        else:
            for key, value in response.data.items():
                if isinstance(value, list):
                    for msg in value:
                        customized_response['errors'].append(
                            {
                                'field': key,
                                'message': msg,
                            }
                        )
                else:
                    customized_response['errors'].append(
                        {
                            'field': key if key != 'detail' else 'non_field_errors',
                            'message': value,
                        }
                    )

        response.data = customized_response
        # response.data['status_code'] = response.status_code
        # response.data['errors'] = exc.get_full_details()

    return response
