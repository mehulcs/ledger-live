import { useTheme } from "@react-navigation/native";
import invariant from "invariant";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import type { StakePool } from "@ledgerhq/live-common/families/cardano/api/api-types";
import { useCardanoFamilyPools } from "@ledgerhq/live-common/families/cardano/react";
import { TrackScreen } from "../../../analytics";
import { ScreenName } from "../../../const";
import { accountScreenSelector } from "../../../reducers/accounts";
import PoolHead from "../shared/PoolHead";
import PoolRow from "../shared/PoolRow";
import SelectPoolSearchBox from "../shared/SearchBox";
import { StackNavigatorProps } from "../../../components/RootNavigator/types/helpers";
import { CardanoDelegationFlowParamList } from "./types";

type Props = StackNavigatorProps<
  CardanoDelegationFlowParamList,
  ScreenName.CardanoDelegationPoolSelect
>;

export default function SelectPool({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { account } = useSelector(accountScreenSelector(route));

  invariant(account, "account must be defined");
  invariant(account.type === "Account", "account must be of type Account");

  const { pools, searchQuery, setSearchQuery, onScrollEndReached } =
    useCardanoFamilyPools(account.currency);

  const onItemPress = useCallback(
    (pool: StakePool) => {
      navigation.navigate(ScreenName.CardanoDelegationSummary, {
        ...route.params,
        pool,
      });
    },
    [navigation, route.params],
  );

  const renderItem = useCallback(
    ({ item }: { item: StakePool }) => (
      <PoolRow account={account} pool={item} onPress={onItemPress} />
    ),
    [onItemPress, account],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <TrackScreen category="DelegationFlow" name="SelectValidator" />
      <SelectPoolSearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View style={styles.header}>
        <PoolHead />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={pools}
        renderItem={renderItem}
        extraData={{}}
        onEndReachedThreshold={1}
        onEndReached={onScrollEndReached}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: "100%",
  },
  header: {
    padding: 16,
  },
  list: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});
