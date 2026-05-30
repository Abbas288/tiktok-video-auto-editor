jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const mockReactNative =
    jest.requireActual<typeof import("react-native")>("react-native");

  function MaterialIconsMock(props: {
    name?: string;
    testID?: string;
    color?: string;
    size?: number;
  }) {
    return mockReact.createElement(
      mockReactNative.Text,
      {
        testID: props.testID ?? `material-icon-${props.name ?? "unknown"}`,
      },
      props.name ?? "icon",
    );
  }

  MaterialIconsMock.glyphMap = {};

  return {
    __esModule: true,
    default: MaterialIconsMock,
  };
});

jest.mock("@expo/vector-icons/Ionicons", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const mockReactNative =
    jest.requireActual<typeof import("react-native")>("react-native");

  function IoniconsMock(props: {
    name?: string;
    testID?: string;
    color?: string;
    size?: number;
  }) {
    return mockReact.createElement(
      mockReactNative.Text,
      {
        testID: props.testID ?? `ion-icon-${props.name ?? "unknown"}`,
      },
      props.name ?? "icon",
    );
  }

  IoniconsMock.glyphMap = {};

  return {
    __esModule: true,
    default: IoniconsMock,
  };
});

jest.mock("@expo/vector-icons", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const mockReactNative =
    jest.requireActual<typeof import("react-native")>("react-native");

  function createIconMock(prefix: string) {
    function IconMock(props: {
      name?: string;
      testID?: string;
      color?: string;
      size?: number;
    }) {
      return mockReact.createElement(
        mockReactNative.Text,
        {
          testID: props.testID ?? `${prefix}-${props.name ?? "unknown"}`,
        },
        props.name ?? "icon",
      );
    }

    IconMock.glyphMap = {};

    return IconMock;
  }

  return {
    __esModule: true,
    MaterialIcons: createIconMock("material-icon"),
    Ionicons: createIconMock("ion-icon"),
  };
});
