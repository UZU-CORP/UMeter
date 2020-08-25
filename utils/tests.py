import json
import typing

class TestMixin:
    def assertJSONContains(self, haystack, needle):
        """My custom assertion."""
        haystack = haystack.decode(encoding="utf-8")
        haystack = json.loads(haystack)
        needle = json.loads(needle)
        for key, value in needle.items():
            if type(value) is dict:
                self.assertJSONContains(bytes(json.dumps(haystack[key]), "utf-8"), json.dumps(value))
            elif type(value) is list:
                for val in value:
                    self.assertIn(val, haystack[key])
            else:
                self.assertJSONEqual(json.dumps(value), json.dumps(haystack[key]))


    def assertResponseStatus(self, response, status: bool):
        self.assertJSONContains(response.content, json.dumps({"status": status}))
