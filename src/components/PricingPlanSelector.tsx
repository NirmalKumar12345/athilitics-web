import CommonPricing from './CommonPricing';

export default function PricingPlanSelector() {
  return (
    <CommonPricing
      showCardWrapper={false}
      showComparison={true}
      showPricingTiers={true}
      showTitle={true}
      savePercentageText="Save 10%"
    />
  );
}
