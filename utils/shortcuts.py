from django.http import JsonResponse
from django.core.paginator import Paginator
from django.conf import settings

def json_response(status, data=None, error=None, number_of_pages=None, previous_page=None, next_page=None):
	return JsonResponse({
		"status": status, 
		"data": data,
		"number_of_pages": number_of_pages,
		"previous_page": previous_page,
		"next_page": next_page,
		"error": error
	})

def to_camel_case(string):
	if '_' not in string:
		return string
	while True:
		pos = string.find('_')
		after = pos + 1
		string = string[0:pos+1] + string[after].upper() + string[after+1:]  # make the char after the underscore uppercase
		string = string[0:pos] + string[after:]  # cut the underscore out of the string
		if '_' not in string:
			return string

def to_pascal_case(string):
	camel_case = to_camel_case(string)
	first_char = camel_case[0]
	first_char_to_upper = first_char.upper()
	return first_char_to_upper + camel_case[1:]

def update_obj(obj, dictionary):
	for key, value in dictionary.items():
		setattr(obj, key, value)


def paginate(querySet, page, itemsPerPage=settings.ITEMS_PER_PAGE):
	paginator = Paginator(querySet, itemsPerPage)
	numberOfPages = paginator.num_pages
	pageN = paginator.get_page(page) if page in paginator.page_range else paginator.get_page(numberOfPages)
	previousPage = pageN.previous_page_number() if pageN.has_previous() else None
	nextPage = pageN.next_page_number() if pageN.has_next() else None
	objectList = pageN.object_list
	return objectList, previousPage, nextPage, numberOfPages,

