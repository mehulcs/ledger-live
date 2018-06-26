// @flow

import React from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import EnsureDeviceAppInteraction from 'components/EnsureDeviceAppInteraction'

import type { StepProps } from '../index'

export default function StepConnectDevice({ account, onChangeAppOpened }: StepProps) {
  return (
    <EnsureDeviceAppInteraction
      account={account}
      waitBeforeSuccess={200}
      onSuccess={() => onChangeAppOpened(true)}
    />
  )
}

export function StepConnectDeviceFooter({
  t,
  transitionTo,
  isAppOpened,
  onSkipConfirm,
}: StepProps) {
  return (
    <Box horizontal flow={2}>
      <Button
        onClick={() => {
          onSkipConfirm()
          transitionTo('receive')
        }}
      >
        {t('app:receive.steps.connectDevice.withoutDevice')}
      </Button>
      <Button disabled={!isAppOpened} primary onClick={() => transitionTo('confirm')}>
        {t('app:common.next')}
      </Button>
    </Box>
  )
}
