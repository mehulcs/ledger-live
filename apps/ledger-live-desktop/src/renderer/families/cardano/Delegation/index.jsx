// @flow
import React from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { AccountLike, Account } from "@ledgerhq/types-live";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import Header from "./Header";
import Row from "./Row";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Delegation = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { cardanoResources } = account;
  invariant(cardanoResources, "cardano account expected");
  const { delegation } = cardanoResources;

  return account.type !== "Account" ? null : (
    <TableContainer mb={6}>
      <TableHeader title={t("delegation.header")} titleProps={{ "data-e2e": "title_Delegation" }} />
      {delegation && delegation.poolId ? (
        <>
          <Header />
          <Row delegation={delegation} account={account} parentAccount={parentAccount} />
        </>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              {t("delegation.delegationEarn")}
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={t("delegation.howItWorks")}
                onClick={() => openURL(urls.stakingTezos)}
              />
            </Box>
          </Box>
          <Box>
            <Button
              primary
              id={"account-delegate-button"}
              onClick={() => {
                dispatch(
                  openModal("MODAL_CARDANO_DELEGATE", {
                    parentAccount,
                    account,
                  }),
                );
              }}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconChartLine size={12} />
                <Box>{t("delegation.title")}</Box>
              </Box>
            </Button>
          </Box>
        </Wrapper>
      )}
    </TableContainer>
  );
};

export default Delegation;
