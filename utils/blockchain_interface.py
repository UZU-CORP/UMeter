import requests

class BlockInterface:
	base_url = 'https://block.io/api/v2/%s'

	def __init__(self, api_key):
		self.api_key = api_key

	def __send_command(self, command, **kwargs):
		kwargs['api_key'] = self.api_key
		return requests.get(BlockInterface.base_url %command, params = kwargs).json()

	def get_new_address(self, **kwargs):
		return self.__send_command('get_new_address', **kwargs)

	def get_balance(self):
		return self.__send_command('get_balance')['data']['available_balance']

	def get_my_addresses(self):
		return self.__send_command('get_my_addresses')

	def get_my_addresses_without_balances(self):
		return self.__send_command('get_my_addresses_without_balances')

	def get_address_balance(self, address):
		return self.__send_command('get_address_balance', addresses = address)['data']['balances'][0]['available_balance']

	def get_address_by_label(self, **kwargs):
		return self.__send_command('get_address_by_label', **kwargs)

	def withdraw(self, pin, **kwargs):
		kwargs['pin'] = pin
		return self.__send_command('withdraw', **kwargs)

	def withdraw_from_addresses(self, pin, **kwargs):
		kwargs['pin'] = pin
		return self.__send_command('withdraw_from_addresses', **kwargs)

	def withdraw_from_label(self, pin, **kwargs):
		kwargs['pin'] = pin
		return self.__send_command('withdraw_from_label', **kwargs)

	def get_current_price(self):
		return self.__send_command('get_current_price')

	def get_network_fee_estimate(self, **kwargs):
		return self.__send_command('get_network_fee_estimate', **kwargs)

	def create_notification(self, **kwargs):
		return self.__send_command("create_notification", **kwargs)

	def disable_notification(self, **kwargs):
		return self.__send_command("disable_notification", **kwargs)

	def enable_notification(self, **kwargs):
		return self.__send_command("enable_notification", **kwargs)

	def get_notifications(self, **kwargs):
		return self.__send_command("get_notifications", **kwargs)

	def get_notifications(self, **kwargs):
		return self.__send_command("get_notifications", **kwargs)

	def delete_notification(self, **kwargs):
		return self.__send_command("delete_notification", **kwargs)

	def get_raw_transaction(self, txid):
		return self.__send_command("get_raw_transaction", txid=txid)
