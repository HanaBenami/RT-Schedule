class Nameable:
    """
    \"name\" attribute from type str should be defined by the derived model and must be unique.
    """

    def __str__(self):
        return self.name

    def __eq__(self, other: object) -> bool:
        if hasattr(other, "name"):
            return self.name == other.name
        else:
            return super().__eq__(other)

    # A class that overrides __eq__() and does not define __hash__() will have its __hash__() implicitly set to None.
    def __hash__(self):
        return super().__hash__()

    def get_details(self) -> dict:
        return {
            key: value
            for (key, value) in self.__dict__.items()
            if not key.startswith("_")
        }
