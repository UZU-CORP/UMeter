from django.core.management.base import BaseCommand, CommandError
import os
from django.conf import settings
from utils.shortcuts import to_pascal_case

ManageDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TemplateDir = os.path.join(ManageDir, 'templates')
ControllerTemplateFile = os.path.join(TemplateDir, 'controller_template.txt')
ModelTemplateFile = os.path.join(TemplateDir, 'model_template.txt')
ServiceTemplateFile = os.path.join(TemplateDir, 'service_template.txt')
TestTemplateFile = os.path.join(TemplateDir, 'test_template.txt')

class Command(BaseCommand):
	"""
	Management command to make files.

	usage e.g: python manage.py make controller admincontroller --app ContentAndSocialMediaApp
	"""

	help = 'command line for UZUCORP backend apps in django'

	def add_arguments(self, parser):
		parser.add_argument('make_what', type=str, help='the name of the action to make')
		parser.add_argument('name', type=str, help='the name of the file and/or class to make')
		parser.add_argument('--path', default='', help='an optional filepath for the file to be saved')
		parser.add_argument('--app', default='', 
					help='name of app folder for the file to be saved, it is case insensitive')


	def handle(self, *args, **options):
		self.__path = options['path']
		self.__action = options['make_what'].lower()
		self.__app = options['app']
		self.__name = options['name'].lower()
		self.__suffix = None
		handlers = {
			'controller': self.__make_controller,
			'model': self.__make_model,
			'service': self.__make_service,
			'test': self.__make_test,
		}
		handler = handlers.get(self.__action, None)
		if handler:
			handler()
		else:
			raise CommandError('invalid action')

	def __make_controller(self):
		self.__suffix = 'controller'
		self.__template_file = ControllerTemplateFile
		self._resolve_classname('Controller')
		self.__file_name = self.__class_name 
		self.__set_path('controllers')
		self.__make_file_from_template()
		self.print_success("controller")

	def __make_model(self):
		self.__template_file = ModelTemplateFile
		self._resolve_classname()
		self.__file_name = self.__name.lower()
		self.__set_path('models')
		self.__make_file_from_template()
		self.print_success("model")

	def __make_service(self):
		self.__suffix = 'service'
		self.__template_file = ServiceTemplateFile
		self._resolve_classname('Service')
		self.__file_name = self.__class_name
		self.__set_path('services')
		self.__make_file_from_template()
		self.print_success("service")

	def __make_test(self):
		self.__template_file = TestTemplateFile
		self._resolve_classname()
		self.__file_name = self.__class_name
		self.__set_path('tests')
		self.__make_file_from_template()	
		self.print_success("test")

	def __make_file_from_template(self):
		self.__create_module_if_not_exist()
		content = self.read_file(self.__template_file)
		content = content.replace("{{CLASS_NAME}}", self.__class_name)
		self.write_file(self.__file_path, content)
		self.modify_init(os.path.dirname(self.__file_path), self.__class_name)

	def __resolve_name_suffix(self):
		suffix = self.__suffix
		if not suffix:
			return
		if self.__name[-len(suffix):] == suffix:
			self.__name = self.__name[:len(self.__name)-len(suffix)]

	def _resolve_classname(self, suffix=''):
		self.__resolve_name_suffix()
		self.__class_name = to_pascal_case(self.__name) + suffix

	def __set_path(self, option):
		file_name = self.__file_name
		if self.__path:
			self.__file_path = os.path.join(self.__path, option, file_name+'.py')
		if not self.__app:
			raise CommandError('app name required')
		if not settings.BASE_DIR:
			raise CommandError('BASE_DIR must be set in settings')
		home_contents = os.scandir(settings.BASE_DIR)
		app_dir = [
			dir_content.path for dir_content in home_contents if dir_content.is_dir() and dir_content.name.lower() == self.__app.lower()
		]
		if not app_dir:
			raise CommandError('app name does not match any folder')
		self.__file_path = os.path.join(app_dir[0], option, file_name+'.py')

	def __create_module_if_not_exist(self):
		folder = os.path.dirname(self.__file_path)
		if os.path.exists(folder):
			return
		os.mkdir(folder)
		self.write_file(os.path.join(folder, '__init__.py'), '')


	def modify_init(self, file_path, class_name):
		file_name = self.__file_name or class_name
		init_file = os.path.join(file_path, '__init__.py')
		init_content = "\nfrom .{} import {}".format(file_name, class_name)
		self.append_file(init_file, init_content)

	def print_success(self, option):
		self.stdout.write(
			self.style.SUCCESS(
				"{} {} has been created in {}".format(option, self.__class_name, self.__file_path)
			)
		)

	def read_file(self, filepath):
		with open(filepath, 'r+') as file:
			content = file.read()
		return content

	def write_file(self, filepath, content):
		with open(filepath, 'w+') as file:
			file.write(content)

	def append_file(self, filepath, content):
		with open(filepath, 'a+') as file:
			file.write(content)		
