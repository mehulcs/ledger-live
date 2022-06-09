import React, { useCallback, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Flex, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import FtsImageProcessor from "./ImageProcessor";

type RouteParams = {
  imageUrl?: string;
  imageBase64?: string;
};

const PreviewImage = styled(Image).attrs({
  resizeMode: "contain",
})`
  width: 300px;
  height: 300px;
`;

export default function ImagePicker() {
  const [srcImageBase64, setSrcImageBase64] = useState<string | null>(null);
  const [resultImageBase64, setResultImageBase64] = useState<string | null>(
    null,
  );

  const { params = {} }: { params?: RouteParams } = useRoute();

  const { imageUrl, imageBase64 } = params;

  useEffect(() => {
    (async function loadSource() {
      if (!srcImageBase64) {
        if (imageBase64) setSrcImageBase64(imageBase64);
        else if (imageUrl) {
          fetch(imageUrl)
            .then(response => response.blob())
            .then(
              data =>
                new Promise((resolve, reject) => {
                  const reader = new FileReader(); // eslint-disable-line no-undef
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(data);
                }),
            )
            .then((data: string) => {
              console.log("obtained image base64", data.slice(0, 30));
              setSrcImageBase64(data);
            });
        }
      }
    })();
  }, [setSrcImageBase64, srcImageBase64, imageUrl, imageBase64]);

  const onImageProcessorResult = useCallback(
    ({ resultImageBase64, data }) => {
      console.log("onImageProcessorResult");
      setResultImageBase64(resultImageBase64);
    },
    [setResultImageBase64],
  );

  return (
    <Flex>
      <Text>hello</Text>
      {srcImageBase64 && (
        <View>
          <Text>
            Webview loaded with base64 src: {srcImageBase64.slice(0, 30)}
          </Text>
          <PreviewImage source={{ uri: srcImageBase64 }} />
          <FtsImageProcessor
            srcImageBase64={srcImageBase64}
            onResult={onImageProcessorResult}
          />
        </View>
      )}
      {resultImageBase64 && (
        <Flex>
          <Text>result:</Text>
          <PreviewImage source={{ uri: resultImageBase64 }} />
        </Flex>
      )}
    </Flex>
  );
}
